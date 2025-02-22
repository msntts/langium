/******************************************************************************
 * Copyright 2022 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { References } from '../../references/references';
import { MultiMap } from '../../utils/collections';
import { AstNodeLocator } from '../../workspace/ast-node-locator';
import { LangiumDocuments } from '../../workspace/documents';
import { Interface, Type, AbstractType, isInterface, isType, TypeDefinition, isUnionType, isSimpleType } from '../generated/ast';
import { PlainInterface, PlainProperty } from './type-collector/plain-types';
import { AstTypes, InterfaceType, isArrayType, isPrimitiveType, isPropertyUnion, isReferenceType, isValueType, PropertyType, TypeOption } from './type-collector/types';

/**
 * Collects all properties of all interface types. Includes super type properties.
 * @param interfaces A topologically sorted array of interfaces.
 */
export function collectAllPlainProperties(interfaces: PlainInterface[]): MultiMap<string, PlainProperty> {
    const map = new MultiMap<string, PlainProperty>();
    for (const interfaceType of interfaces) {
        map.addAll(interfaceType.name, interfaceType.properties);
    }
    for (const interfaceType of interfaces) {
        for (const superType of interfaceType.superTypes) {
            const superTypeProperties = map.get(superType);
            if (superTypeProperties) {
                map.addAll(interfaceType.name, superTypeProperties);
            }
        }
    }
    return map;
}

export function distinctAndSorted<T>(list: T[], compareFn?: (a: T, b: T) => number): T[] {
    return Array.from(new Set(list)).sort(compareFn);
}

export function collectChildrenTypes(interfaceNode: Interface, references: References, langiumDocuments: LangiumDocuments, nodeLocator: AstNodeLocator): Set<Interface | Type> {
    const childrenTypes = new Set<Interface | Type>();
    childrenTypes.add(interfaceNode);
    const refs = references.findReferences(interfaceNode, {});
    refs.forEach(ref => {
        const doc = langiumDocuments.getOrCreateDocument(ref.sourceUri);
        const astNode = nodeLocator.getAstNode(doc.parseResult.value, ref.sourcePath);
        if (isInterface(astNode)) {
            childrenTypes.add(astNode);
            const childrenOfInterface = collectChildrenTypes(astNode, references, langiumDocuments, nodeLocator);
            childrenOfInterface.forEach(child => childrenTypes.add(child));
        } else if (astNode && isType(astNode.$container)) {
            childrenTypes.add(astNode.$container);
        }
    });
    return childrenTypes;
}

export function collectTypeHierarchy(types: TypeOption[]): {
    superTypes: MultiMap<string, string>
    subTypes: MultiMap<string, string>
} {
    const duplicateSuperTypes = new MultiMap<string, string>();
    const duplicateSubTypes = new MultiMap<string, string>();
    for (const type of types) {
        for (const superType of type.superTypes) {
            duplicateSuperTypes.add(type.name, superType.name);
            duplicateSubTypes.add(superType.name, type.name);
        }
        for (const subType of type.subTypes) {
            duplicateSuperTypes.add(subType.name, type.name);
            duplicateSubTypes.add(type.name, subType.name);
        }
    }
    const superTypes = new MultiMap<string, string>();
    const subTypes = new MultiMap<string, string>();
    // Deduplicate and sort
    for (const [name, superTypeList] of Array.from(duplicateSuperTypes.entriesGroupedByKey()).sort(([aName], [bName]) => aName.localeCompare(bName))) {
        superTypes.addAll(name, Array.from(new Set(superTypeList)));
    }
    for (const [name, subTypeList] of Array.from(duplicateSubTypes.entriesGroupedByKey()).sort(([aName], [bName]) => aName.localeCompare(bName))) {
        subTypes.addAll(name, Array.from(new Set(subTypeList)));
    }
    return {
        superTypes,
        subTypes
    };
}

export function collectSuperTypes(ruleNode: AbstractType): Set<Interface> {
    const superTypes = new Set<Interface>();
    if (isInterface(ruleNode)) {
        superTypes.add(ruleNode);
        ruleNode.superTypes.forEach(superType => {
            if (isInterface(superType.ref)) {
                superTypes.add(superType.ref);
                const collectedSuperTypes = collectSuperTypes(superType.ref);
                for (const superType of collectedSuperTypes) {
                    superTypes.add(superType);
                }
            }
        });
    } else if (isType(ruleNode)) {
        const usedTypes = collectUsedTypes(ruleNode.type);
        for (const usedType of usedTypes) {
            const collectedSuperTypes = collectSuperTypes(usedType);
            for (const superType of collectedSuperTypes) {
                superTypes.add(superType);
            }
        }
    }
    return superTypes;
}

function collectUsedTypes(typeDefinition: TypeDefinition): Array<Interface | Type> {
    if (isUnionType(typeDefinition)) {
        return typeDefinition.types.flatMap(e => collectUsedTypes(e));
    } else if (isSimpleType(typeDefinition)) {
        const value = typeDefinition.typeRef?.ref;
        if (isType(value) || isInterface(value)) {
            return [value];
        }
    }
    return [];
}

export function mergeInterfaces(inferred: AstTypes, declared: AstTypes): InterfaceType[] {
    return inferred.interfaces.concat(declared.interfaces);
}

export function mergeTypesAndInterfaces(astTypes: AstTypes): TypeOption[] {
    return (astTypes.interfaces as TypeOption[]).concat(astTypes.unions);
}

/**
 * Performs topological sorting on the generated interfaces.
 * @param interfaces The interfaces to sort topologically.
 * @returns A topologically sorted set of interfaces.
 */
export function sortInterfacesTopologically(interfaces: PlainInterface[]): PlainInterface[] {
    type TypeNode = {
        value: PlainInterface;
        nodes: TypeNode[];
    }

    const nodes: TypeNode[] = interfaces
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(e => <TypeNode>{ value: e, nodes: [] });
    for (const node of nodes) {
        node.nodes = nodes.filter(e => node.value.superTypes.has(e.value.name));
    }
    const l: TypeNode[] = [];
    const s = nodes.filter(e => e.nodes.length === 0);
    while (s.length > 0) {
        const n = s.shift()!;
        if (!l.includes(n)) {
            l.push(n);
            nodes
                .filter(e => e.nodes.includes(n))
                .forEach(m => s.push(m));
        }
    }
    return l.map(e => e.value);
}

export function hasArrayType(type: PropertyType): boolean {
    if (isPropertyUnion(type)) {
        return type.types.some(e => hasArrayType(e));
    } else if (isArrayType(type)) {
        return true;
    } else {
        return false;
    }
}

export function hasBooleanType(type: PropertyType): boolean {
    if (isPropertyUnion(type)) {
        return type.types.some(e => hasBooleanType(e));
    } else if (isPrimitiveType(type)) {
        return type.primitive === 'boolean';
    } else {
        return false;
    }
}

export function findReferenceTypes(type: PropertyType): string[] {
    if (isPropertyUnion(type)) {
        return type.types.flatMap(e => findReferenceTypes(e));
    } else if (isReferenceType(type)) {
        const refType = type.referenceType;
        if (isValueType(refType)) {
            return [refType.value.name];
        }
    } else if (isArrayType(type)) {
        return findReferenceTypes(type.elementType);
    }
    return [];
}
