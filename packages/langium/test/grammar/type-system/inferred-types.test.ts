/******************************************************************************
 * Copyright 2022 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { describe, expect, test } from 'vitest';
import { createLangiumGrammarServices, Grammar, EmptyFileSystem, expandToString, EOL } from '../../../src';
import { mergeTypesAndInterfaces } from '../../../src/grammar/type-system';
import { collectAst } from '../../../src/grammar/type-system/ast-collector';
import { AstTypes } from '../../../src/grammar/type-system/type-collector/types';
import { clearDocuments, parseHelper } from '../../../src/test';

describe('Inferred types', () => {

    test('Should infer types of simple grammars', async () => {
        await expectTypes(`
            A: name=ID value=NUMBER?;
            B: name=FQN values+=NUMBER;
            C: 'c' ref=[A];

            FQN: ID;
            terminal ID returns string: /string/;
            terminal NUMBER returns number: /number/;
        `, expandToString`
            export interface A extends AstNode {
                readonly $type: 'A';
                name: string
                value?: number
            }
            export interface B extends AstNode {
                readonly $type: 'B';
                name: FQN
                values: Array<number>
            }
            export interface C extends AstNode {
                readonly $type: 'C';
                ref: Reference<A>
            }
            export type FQN = string;
        `);
    });

    test('Should infer types for alternatives', async () => {
        await expectTypes(`
            A: name=ID | name=NUMBER;
            B: name=(ID | NUMBER);
            C: A | B;
            D: A | B | name=ID;
            E: name=ID | value=NUMBER;

            terminal ID returns string: /string/;
            terminal NUMBER returns number: /number/;
        `, expandToString`
            export interface D extends AstNode {
                readonly $type: 'A' | 'B' | 'D';
                name: string
            }
            export interface E extends AstNode {
                readonly $type: 'E';
                name?: string
                value?: number
            }
            export interface A extends D {
                readonly $type: 'A';
                name: number | string
            }
            export interface B extends D {
                readonly $type: 'B';
                name: number | string
            }
            export type C = A | B;
        `);
    });

    test('Should correctly infer types using chained actions', async () => {
        await expectTypes(`
            A: a=ID ({infer B} b=ID ({infer C} c=ID)?)? d=ID;
            terminal ID returns string: /string/;
        `, expandToString`
            export interface A extends AstNode {
                readonly $type: 'A' | 'B' | 'C';
                a: string
                d: string
            }
            export interface B extends A {
                readonly $type: 'B' | 'C';
                b: string
                d: string
            }
            export interface C extends B {
                readonly $type: 'C';
                c: string
                d: string
            }
        `);
    });

    test('Should correctly infer types using chained actions with assignments', async () => {
        await expectTypes(`
            A: B ({infer B.b=current} c=ID)?;
            B: a=ID;
            terminal ID returns string: /string/;
        `, expandToString`
            export interface B extends AstNode {
                readonly $container: B;
                readonly $type: 'B';
                a?: string
                b?: B
                c?: string
            }
            export type A = B;
        `);
    });

    test('Should correctly infer types using actions in repetitions', async () => {
        await expectTypes(`
            A: value=ID ({infer A.item=current} value=ID)*;
            terminal ID returns string: /string/;
        `, expandToString`
            export interface A extends AstNode {
                readonly $container: A;
                readonly $type: 'A';
                item?: A
                value: string
            }
        `);
    });

    test('Should correctly infer types using unassinged and assigned actions', async () => {
        await expectTypes(`
            A: ({infer X} x=ID | {infer Y} y=ID | {infer Z} z=ID) {infer B.front=current} back=ID;
            terminal ID returns string: /string/;
        `, expandToString`
            export interface B extends AstNode {
                readonly $container: B;
                readonly $type: 'B';
                back: string
                front: X | Y | Z
            }
            export interface X extends AstNode {
                readonly $container: B;
                readonly $type: 'X';
                x: string
            }
            export interface Y extends AstNode {
                readonly $container: B;
                readonly $type: 'Y';
                y: string
            }
            export interface Z extends AstNode {
                readonly $container: B;
                readonly $type: 'Z';
                z: string
            }
            export type A = B | X | Y | Z;
        `);
    });

    test('Should correctly infer types using actions and infer keyword', async () => {
        await expectTypes(`
            A: a=ID;
            B infers A: A {infer B} b=ID;
            terminal ID returns string: /string/;
        `, expandToString`
            export interface A extends AstNode {
                readonly $type: 'A' | 'B';
                a: string
            }
            export interface B extends A {
                readonly $type: 'B';
                b: string
            }
        `);
    });

    test('Should infer actions with alternatives and fragments correctly', async () => {
        await expectTypes(`
            Entry:
                Expr;
            Expr:
                {infer Ref} ref=ID
                ({infer Access.receiver=current} '.' member=ID)*;
            Ref:
                {infer Ref} ref=ID;
            Access:
                {infer Access} '.' member=ID;
        
            IdRule:
                'id' name=ID;
            RuleName infers RuleType:
                IdRule (
                    {infer FirstBranch.value=current} FirstBranchFragment
                |   {infer SecondBranch.value=current} SecondBranchFragment
                );
            fragment FirstBranchFragment: 'First' first=ID;
            fragment SecondBranchFragment: 'Second' second=ID;
        
            terminal ID returns string: /string/;
        `, expandToString`
            export interface Access extends AstNode {
                readonly $container: Access;
                readonly $type: 'Access';
                member: string
                receiver?: Ref
            }
            export interface FirstBranch extends AstNode {
                readonly $container: FirstBranch | SecondBranch;
                readonly $type: 'FirstBranch';
                first: string
                value: IdRule
            }
            export interface IdRule extends AstNode {
                readonly $container: FirstBranch | SecondBranch;
                readonly $type: 'IdRule';
                name: string
            }
            export interface Ref extends AstNode {
                readonly $container: Access;
                readonly $type: 'Ref';
                ref: string
            }
            export interface SecondBranch extends AstNode {
                readonly $container: FirstBranch | SecondBranch;
                readonly $type: 'SecondBranch';
                second: string
                value: IdRule
            }
            export type Entry = Expr;
            export type Expr = Access | Ref;
            export type RuleType = FirstBranch | IdRule | SecondBranch;
        `);
    });

    test('Should correctly infer types with common names', async () => {
        await expectTypes(`
            A infers X: a=ID;
            B infers X: a=ID b=ID;
            C infers X: a=ID c=ID?;

            terminal ID returns string: /string/;
        `, expandToString`
            export interface X extends AstNode {
                readonly $type: 'X';
                a: string
                b?: string
                c?: string
            }
        `);
    });

    test('Should infer types with common names and actions', async () => {
        await expectTypes(`
            A infers X: {infer A} a=ID;
            B infers X: {infer B} b=ID;

            C: D ({infer C.item=current} value=ID);
            D infers Y: y=ID;

            terminal ID returns string: /string/;
        `, expandToString`
            export interface A extends AstNode {
                readonly $type: 'A';
                a: string
            }
            export interface B extends AstNode {
                readonly $type: 'B';
                b: string
            }
            export interface C extends AstNode {
                readonly $container: C;
                readonly $type: 'C' | 'Y';
                item: Y
                value: string
            }
            export interface Y extends C {
                readonly $container: C;
                readonly $type: 'Y';
                y: string
            }
            export type X = A | B;
        `);
    });

    test('Should infer data type rules as unions', async () => {
        expectTypes(`
            Strings returns string: 'a' | 'b' | 'c';
            MoreStrings returns string: Strings | 'd' | 'e';
            Complex returns string: ID ('.' ID)*;
            DateLike returns Date: 'x';
            terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
        `, expandToString`
            export type Complex = string;
            export type DateLike = Date;
            export type MoreStrings = 'd' | 'e' | Strings;
            export type Strings = 'a' | 'b' | 'c';
        `);
    });

    test('Infers X as a super interface of Y and Z with property `id`', async () => {
        expectTypes(`
            entry X: id=ID ({infer Y} 'a' | {infer Z} 'b');
            terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
        `, expandToString`
            export interface X extends AstNode {
                readonly $type: 'X' | 'Y' | 'Z';
                id: string
            }
            export interface Y extends X {
                readonly $type: 'Y';
            }
            export interface Z extends X {
                readonly $type: 'Z';
            }
        `);
    });
});

describe('inferred types that are used by the grammar', () => {
    test('B is defined and A is not', async () => {
        expectTypes(`
            A infers B: 'a' name=ID (otherA=[B])?;
            hidden terminal WS: /\\s+/;
            terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
        `, expandToString`
            export interface B extends AstNode {
                readonly $type: 'B';
                name: string
                otherA?: Reference<B>
            }
        `);
    });
});

describe('inferred and declared types', () => {
    test('Declared interfaces should be preserved as interfaces', async () => {
        expectTypes(`
            X returns X: Y | Z;
            Y: y='y';
            Z: z='z';
        
            interface X { }
        `, expandToString`
            export interface X extends AstNode {
                readonly $type: 'X' | 'Y' | 'Z';
            }
            export interface Y extends X {
                readonly $type: 'Y';
                y: 'y'
            }
            export interface Z extends X {
                readonly $type: 'Z';
                z: 'z'
            }
        `);
    });
});

describe('expression rules with inferred and declared interfaces', () => {

    test('separate rules with assigned actions with inferred type and declared sub type of the former', async () => {
        await checkTypes(`
            interface Symbol {}
            interface SuperMemberAccess extends MemberAccess {}

            Expression:
                PrimaryExpression | MemberAccess | SuperMemberAccess
            ;

            PrimaryExpression:
                BooleanLiteral
            ;

            MemberAccess infers Expression:
                PrimaryExpression (
                    {infer MemberAccess.receiver=current} '.' member=[Symbol:'foo']
                )+
            ;

            SuperMemberAccess infers Expression:
                PrimaryExpression (
                    {SuperMemberAccess.receiver=current} '.' member=[Symbol:'super']
                )+
            ;

            BooleanLiteral:
                {infer BooleanLiteral} value?='true' | 'false'
            ;
        `);
    });

    test('single rule with two assigned actions with inferred type and declared sub type of the former', async () => {
        await checkTypes(`
            interface Symbol {}
            interface SuperMemberAccess extends MemberAccess {}

            Expression:
                PrimaryExpression | MemberAccess
            ;

            PrimaryExpression:
                BooleanLiteral
            ;

            MemberAccess infers Expression:
                PrimaryExpression (
                    {SuperMemberAccess.receiver=current} '.' member=[Symbol:'super'] |
                    {infer MemberAccess.receiver=current} '.' member=[Symbol:'foo']
                )+
            ;

            BooleanLiteral:
                {infer BooleanLiteral} value?='true' | 'false'
            ;
        `);
    });

    // todo make tests like in this PR: https://github.com/langium/langium/pull/670
    // the PR #670 fixes the demonstrated bug, but cancels type inferrence for declared actions
    // we should fix the issue another way
    async function checkTypes(grammar: string): Promise<void> {
        await expectTypes(grammar, expandToString`
            export interface BooleanLiteral extends AstNode {
                readonly $container: MemberAccess;
                readonly $type: 'BooleanLiteral';
                value: boolean
            }
            export interface MemberAccess extends AstNode {
                readonly $container: MemberAccess;
                readonly $type: 'MemberAccess' | 'SuperMemberAccess';
                member: Reference<Symbol>
                receiver: PrimaryExpression
            }
            export interface Symbol extends AstNode {
                readonly $type: 'Symbol';
            }
            export interface SuperMemberAccess extends MemberAccess {
                readonly $container: MemberAccess;
                readonly $type: 'SuperMemberAccess';
            }
            export type Expression = MemberAccess | PrimaryExpression | SuperMemberAccess;
            export type PrimaryExpression = BooleanLiteral;
        `);
    }
});

describe('types of `$container` and `$type` are correct', () => {

    // `$container`-types are appear only from inferred types
    test('types of `$container` and `$type` for declared types', async () => {
        await expectTypes(`
            interface A { strA: string }
            interface B { strB: string }
            interface C extends A, B { strC: string }
            interface D { a: A }
            interface E { b: B }
        `, expandToString`
            export interface A extends AstNode {
                readonly $container: D | E;
                readonly $type: 'A' | 'C';
                strA: string
            }
            export interface B extends AstNode {
                readonly $container: D | E;
                readonly $type: 'B' | 'C';
                strB: string
            }
            export interface D extends AstNode {
                readonly $type: 'D';
                a: A
            }
            export interface E extends AstNode {
                readonly $type: 'E';
                b: B
            }
            export interface C extends A, B {
                readonly $container: D | E;
                readonly $type: 'C';
                strC: string
            }
        `);
    });

    test('types of `$container` and `$type` for inferred types', async () => {
        await expectTypes(`
            terminal ID: /[_a-zA-Z][\\w_]*/;
            A: 'A' C;
            B: 'B' C;
            C: 'C' strC=ID;
            D: 'D' a=A;
            E: 'E' b=B;
        `, expandToString`
            export interface C extends AstNode {
                readonly $container: D | E;
                readonly $type: 'C';
                strC: string
            }
            export interface D extends AstNode {
                readonly $type: 'D';
                a: A
            }
            export interface E extends AstNode {
                readonly $type: 'E';
                b: B
            }
            export type A = C;
            export type B = C;
        `);
    });

    test('types of `$container` and `$type` for inferred and declared types', async () => {
        await expectTypes(`
            A: 'A' strA=ID;
            B: 'B' strB=ID;
            C returns C: 'C' strA=ID strB=ID strC=ID;
            interface C extends A, B { strC: string }
            D: 'D' a=A;
            E: 'E' b=B;
            terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
        `, expandToString`
            export interface A extends AstNode {
                readonly $container: D | E;
                readonly $type: 'A' | 'C';
                strA: string
            }
            export interface B extends AstNode {
                readonly $container: D | E;
                readonly $type: 'B' | 'C';
                strB: string
            }
            export interface D extends AstNode {
                readonly $type: 'D';
                a: A
            }
            export interface E extends AstNode {
                readonly $type: 'E';
                b: B
            }
            export interface C extends A, B {
                readonly $container: D | E;
                readonly $type: 'C';
                strC: string
            }
        `);
    });
});

// https://github.com/langium/langium/issues/744
describe('generated types from declared types include all of them', () => {

    test('using declared types has no impact on the generated types', async () => {
        const grammarServices = createLangiumGrammarServices(EmptyFileSystem).grammar;
        const document = await parseHelper<Grammar>(grammarServices)(`
            A: 'A' a=ID;
            AB: A ({infer B} b+=ID)*;
            terminal ID: /[_a-zA-Z][\\w_]*/;
        `);
        const types = collectAst(document.parseResult.value);

        const documentWithDeclaredTypes = await parseHelper<Grammar>(grammarServices)(`
            interface A { a: string; }
            interface B extends A { b: string[]; }
            type AB = A | B;
            A returns A:  'A' a=ID;
            AB returns AB: A ({B} b+=ID)*;
            terminal ID: /[_a-zA-Z][\\w_]*/;
        `);
        const typesWithDeclared = collectAst(documentWithDeclaredTypes.parseResult.value);

        expect(typesWithDeclared.unions.map(e => e.toAstTypesString(false)).join(EOL).trim())
            .toBe(types.unions.map(e => e.toAstTypesString(false)).join(EOL).trim());

        expect(typesWithDeclared.interfaces.map(e => e.toAstTypesString(false)).join(EOL).trim())
            .toBe(types.interfaces.map(e => e.toAstTypesString(false)).join(EOL).trim());
    });

});

// TODO @msujew: Test case for https://github.com/langium/langium/issues/775
// describe('type merging runs in non-exponential time', () => {
//
//     test('grammar with many optional groups is processed correctly', async () => {
//         const grammarServices = createLangiumGrammarServices(EmptyFileSystem).grammar;
//         const document = await parseHelper<Grammar>(grammarServices)(`
//         grammar Test
//
//         entry Model:
//             (title1=INT ';')?
//             (title2=INT ';')?
//             (title3=INT ';')?
//             (title4=INT ';')?
//             (title5=INT ';')?
//             (title6=INT ';')?
//             (title7=INT ';')?
//             (title8=INT ';')?
//             (title9=INT ';')?
//             (title10=INT ';')?
//             (title11=INT ';')?
//             (title12=INT ';')?
//             (title13=INT ';')?
//             (title14=INT ';')?
//             (title15=INT ';')?
//             (title16=INT ';')?
//             (title17=INT ';')?
//             (title18=INT ';')?
//             (title19=INT ';')?
//             (title20=INT ';')?
//             (title21=INT ';')?
//             (title22=INT ';')?
//             (title23=INT ';')?
//             (title24=INT ';')?
//             (title25=INT ';')?
//             (title26=INT ';')?
//             (title27=INT ';')?
//             (title28=INT ';')?
//             (title29=INT ';')?
//             (title30=INT ';')?
//         ;
//         terminal INT returns number: ('0'..'9')+;
//         `);
//         const { interfaces } = collectAst(document.parseResult.value);
//         const model = interfaces[0];
//         expect(model.properties).toHaveLength(30);
//         expect(model.properties.every(e => e.optional)).toBeTruthy();
//     });
//
// });

const services = createLangiumGrammarServices(EmptyFileSystem).grammar;

async function getTypes(grammar: string): Promise<AstTypes> {
    await clearDocuments(services);
    const helper = parseHelper<Grammar>(services);
    const result = await helper(grammar);
    const gram = result.parseResult.value;
    return collectAst(gram);
}

async function expectTypes(grammar: string, types: string): Promise<void> {
    const grammarTypes = await getTypes(grammar);
    const allTypes = mergeTypesAndInterfaces(grammarTypes);
    expect(allTypes.map(type => type.toAstTypesString(false)).join('').trim()).toBe(types);
}
