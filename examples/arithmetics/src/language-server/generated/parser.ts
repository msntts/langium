/******************************************************************************
 * This file was generated by langium-cli 0.0.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
// @ts-nocheck
import { createToken, Lexer } from 'chevrotain';
import { LangiumParser, LangiumServices, DatatypeSymbol } from 'langium';
import { ArithmeticsGrammarAccess } from './grammar-access';
import { AbstractDefinition, Expression, Import, Module, Statement, DeclaredParameter, Definition, Addition, Division, FunctionCall, Multiplication, NumberLiteral, Subtraction, Evaluation, } from './ast';

const ID = createToken({ name: 'ID', pattern: /[_a-zA-Z][\w_]*/ });
const NUMBER = createToken({ name: 'NUMBER', pattern: /[0-9]+(\.[0-9])?/ });
const WS = createToken({ name: 'WS', pattern: /\s+/, group: Lexer.SKIPPED });
const ImportKeyword = createToken({ name: 'ImportKeyword', pattern: /import/, longer_alt: ID });
const ModuleKeyword = createToken({ name: 'ModuleKeyword', pattern: /module/, longer_alt: ID });
const DefKeyword = createToken({ name: 'DefKeyword', pattern: /def/, longer_alt: ID });
const AsteriskKeyword = createToken({ name: 'AsteriskKeyword', pattern: /\*/, longer_alt: ID });
const ColonKeyword = createToken({ name: 'ColonKeyword', pattern: /:/, longer_alt: ID });
const CommaKeyword = createToken({ name: 'CommaKeyword', pattern: /,/, longer_alt: ID });
const DashKeyword = createToken({ name: 'DashKeyword', pattern: /-/, longer_alt: ID });
const ParenthesisCloseKeyword = createToken({ name: 'ParenthesisCloseKeyword', pattern: /\)/, longer_alt: ID });
const ParenthesisOpenKeyword = createToken({ name: 'ParenthesisOpenKeyword', pattern: /\(/, longer_alt: ID });
const PlusKeyword = createToken({ name: 'PlusKeyword', pattern: /\+/, longer_alt: ID });
const SemicolonKeyword = createToken({ name: 'SemicolonKeyword', pattern: /;/, longer_alt: ID });
const SlashKeyword = createToken({ name: 'SlashKeyword', pattern: /\//, longer_alt: ID });

DashKeyword.LABEL = "'-'";
CommaKeyword.LABEL = "','";
SemicolonKeyword.LABEL = "';'";
ColonKeyword.LABEL = "':'";
ParenthesisOpenKeyword.LABEL = "'('";
ParenthesisCloseKeyword.LABEL = "')'";
AsteriskKeyword.LABEL = "'*'";
SlashKeyword.LABEL = "'/'";
PlusKeyword.LABEL = "'+'";
DefKeyword.LABEL = "'def'";
ImportKeyword.LABEL = "'import'";
ModuleKeyword.LABEL = "'module'";
const tokens = [ImportKeyword, ModuleKeyword, DefKeyword, AsteriskKeyword, ColonKeyword, CommaKeyword, DashKeyword, ParenthesisCloseKeyword, ParenthesisOpenKeyword, PlusKeyword, SemicolonKeyword, SlashKeyword, ID, NUMBER, WS];

export class Parser extends LangiumParser {
    readonly grammarAccess: ArithmeticsGrammarAccess;

    constructor(services: LangiumServices) {
        super(tokens, services);
    }

    Module = this.MAIN_RULE("Module", Module, () => {
        this.initializeElement(this.grammarAccess.Module);
        this.consume(1, ModuleKeyword, this.grammarAccess.Module.ModuleKeyword);
        this.consume(2, ID, this.grammarAccess.Module.nameIDRuleCall);
        this.many(1, () => {
            this.subrule(1, this.Import, this.grammarAccess.Module.importsImportRuleCall);
        });
        this.many(2, () => {
            this.subrule(2, this.Statement, this.grammarAccess.Module.statementsStatementRuleCall);
        });
        return this.construct();
    });

    Import = this.DEFINE_RULE("Import", Import, () => {
        this.initializeElement(this.grammarAccess.Import);
        this.consume(1, ImportKeyword, this.grammarAccess.Import.ImportKeyword);
        this.consume(2, ID, this.grammarAccess.Import.moduleModuleCrossReference);
        return this.construct();
    });

    Statement = this.DEFINE_RULE("Statement", Statement, () => {
        this.initializeElement(this.grammarAccess.Statement);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.Definition, this.grammarAccess.Statement.DefinitionRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.Evaluation, this.grammarAccess.Statement.EvaluationRuleCall);
            },
        ]);
        return this.construct();
    });

    Definition = this.DEFINE_RULE("Definition", Definition, () => {
        this.initializeElement(this.grammarAccess.Definition);
        this.consume(1, DefKeyword, this.grammarAccess.Definition.DefKeyword);
        this.consume(2, ID, this.grammarAccess.Definition.nameIDRuleCall);
        this.option(1, () => {
            this.consume(3, ParenthesisOpenKeyword, this.grammarAccess.Definition.ParenthesisOpenKeyword);
            this.subrule(1, this.DeclaredParameter, this.grammarAccess.Definition.argsDeclaredParameterRuleCall);
            this.many(1, () => {
                this.consume(4, CommaKeyword, this.grammarAccess.Definition.CommaKeyword);
                this.subrule(2, this.DeclaredParameter, this.grammarAccess.Definition.argsDeclaredParameterRuleCall);
            });
            this.consume(5, ParenthesisCloseKeyword, this.grammarAccess.Definition.ParenthesisCloseKeyword);
        });
        this.consume(6, ColonKeyword, this.grammarAccess.Definition.ColonKeyword);
        this.subrule(3, this.Expression, this.grammarAccess.Definition.exprExpressionRuleCall);
        this.consume(7, SemicolonKeyword, this.grammarAccess.Definition.SemicolonKeyword);
        return this.construct();
    });

    DeclaredParameter = this.DEFINE_RULE("DeclaredParameter", DeclaredParameter, () => {
        this.initializeElement(this.grammarAccess.DeclaredParameter);
        this.consume(1, ID, this.grammarAccess.DeclaredParameter.nameIDRuleCall);
        return this.construct();
    });

    AbstractDefinition = this.DEFINE_RULE("AbstractDefinition", AbstractDefinition, () => {
        this.initializeElement(this.grammarAccess.AbstractDefinition);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.Definition, this.grammarAccess.AbstractDefinition.DefinitionRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.DeclaredParameter, this.grammarAccess.AbstractDefinition.DeclaredParameterRuleCall);
            },
        ]);
        return this.construct();
    });

    Evaluation = this.DEFINE_RULE("Evaluation", Evaluation, () => {
        this.initializeElement(this.grammarAccess.Evaluation);
        this.subrule(1, this.Expression, this.grammarAccess.Evaluation.expressionExpressionRuleCall);
        this.consume(1, SemicolonKeyword, this.grammarAccess.Evaluation.SemicolonKeyword);
        return this.construct();
    });

    Expression = this.DEFINE_RULE("Expression", Expression, () => {
        this.initializeElement(this.grammarAccess.Expression);
        this.unassignedSubrule(1, this.Addition, this.grammarAccess.Expression.AdditionRuleCall);
        return this.construct();
    });

    Addition = this.DEFINE_RULE("Addition", Expression, () => {
        this.initializeElement(this.grammarAccess.Addition);
        this.unassignedSubrule(1, this.Multiplication, this.grammarAccess.Addition.MultiplicationRuleCall);
        this.many(1, () => {
            this.or(1, [
                () => {
                    this.action(Addition, this.grammarAccess.Addition.AdditionleftAction);
                    this.consume(1, PlusKeyword, this.grammarAccess.Addition.PlusKeyword);
                },
                () => {
                    this.action(Subtraction, this.grammarAccess.Addition.SubtractionleftAction);
                    this.consume(2, DashKeyword, this.grammarAccess.Addition.DashKeyword);
                },
            ]);
            this.subrule(2, this.Multiplication, this.grammarAccess.Addition.rightMultiplicationRuleCall);
        });
        return this.construct();
    });

    Multiplication = this.DEFINE_RULE("Multiplication", Expression, () => {
        this.initializeElement(this.grammarAccess.Multiplication);
        this.unassignedSubrule(1, this.PrimaryExpression, this.grammarAccess.Multiplication.PrimaryExpressionRuleCall);
        this.many(1, () => {
            this.or(1, [
                () => {
                    this.action(Multiplication, this.grammarAccess.Multiplication.MultiplicationleftAction);
                    this.consume(1, AsteriskKeyword, this.grammarAccess.Multiplication.AsteriskKeyword);
                },
                () => {
                    this.action(Division, this.grammarAccess.Multiplication.DivisionleftAction);
                    this.consume(2, SlashKeyword, this.grammarAccess.Multiplication.SlashKeyword);
                },
            ]);
            this.subrule(2, this.PrimaryExpression, this.grammarAccess.Multiplication.rightPrimaryExpressionRuleCall);
        });
        return this.construct();
    });

    PrimaryExpression = this.DEFINE_RULE("PrimaryExpression", Expression, () => {
        this.initializeElement(this.grammarAccess.PrimaryExpression);
        this.or(1, [
            () => {
                this.consume(1, ParenthesisOpenKeyword, this.grammarAccess.PrimaryExpression.ParenthesisOpenKeyword);
                this.unassignedSubrule(1, this.Expression, this.grammarAccess.PrimaryExpression.ExpressionRuleCall);
                this.consume(2, ParenthesisCloseKeyword, this.grammarAccess.PrimaryExpression.ParenthesisCloseKeyword);
            },
            () => {
                this.action(NumberLiteral, this.grammarAccess.PrimaryExpression.NumberLiteralAction);
                this.consume(3, NUMBER, this.grammarAccess.PrimaryExpression.valueNUMBERRuleCall);
            },
            () => {
                this.action(FunctionCall, this.grammarAccess.PrimaryExpression.FunctionCallAction);
                this.consume(4, ID, this.grammarAccess.PrimaryExpression.funcAbstractDefinitionCrossReference);
                this.option(1, () => {
                    this.consume(5, ParenthesisOpenKeyword, this.grammarAccess.PrimaryExpression.ParenthesisOpenKeyword);
                    this.subrule(2, this.Expression, this.grammarAccess.PrimaryExpression.argsExpressionRuleCall);
                    this.many(1, () => {
                        this.consume(6, CommaKeyword, this.grammarAccess.PrimaryExpression.CommaKeyword);
                        this.subrule(3, this.Expression, this.grammarAccess.PrimaryExpression.argsExpressionRuleCall);
                    });
                    this.consume(7, ParenthesisCloseKeyword, this.grammarAccess.PrimaryExpression.ParenthesisCloseKeyword);
                });
            },
        ]);
        return this.construct();
    });

}
