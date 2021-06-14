/* eslint-disable */
// @ts-nocheck
import { createToken, Lexer } from 'chevrotain';
import { LangiumServices } from '../../services';
import { LangiumParser, Number, String } from '../../parser/langium-parser';
import { LangiumGrammarGrammarAccess } from './grammar-access';
import { AbstractElement, AbstractMetamodelDeclaration, AbstractNegatedToken, AbstractRule, Annotation, Condition, EnumLiteralDeclaration, EnumLiterals, Grammar, NamedArgument, Parameter, TerminalGroup, TerminalToken, TerminalTokenElement, Action, Alternatives, Assignment, CrossReference, Group, Keyword, RuleCall, UnorderedGroup, GeneratedMetamodel, ReferencedMetamodel, NegatedToken, UntilToken, EnumRule, ParserRule, TerminalRule, Conjunction, Disjunction, LiteralCondition, Negation, ParameterReference, CharacterRange, TerminalAlternatives, TerminalRuleCall, Wildcard, } from './ast';

const ID = createToken({ name: 'ID', pattern: /\^?[_a-zA-Z][\w_]*/ });
const INT = createToken({ name: 'INT', pattern: /[0-9]+/ });
const RegexLiteral = createToken({ name: 'RegexLiteral', pattern: /\/(?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+\// });
const string = createToken({ name: 'string', pattern: /"[^"]*"|'[^']*'/ });
const WS = createToken({ name: 'WS', pattern: /\s+/, group: Lexer.SKIPPED });
const FragmentKeyword = createToken({ name: 'FragmentKeyword', pattern: /fragment/, longer_alt: ID });
const GenerateKeyword = createToken({ name: 'GenerateKeyword', pattern: /generate/, longer_alt: ID });
const TerminalKeyword = createToken({ name: 'TerminalKeyword', pattern: /terminal/, longer_alt: ID });
const CurrentKeyword = createToken({ name: 'CurrentKeyword', pattern: /current/, longer_alt: ID });
const GrammarKeyword = createToken({ name: 'GrammarKeyword', pattern: /grammar/, longer_alt: ID });
const ReturnsKeyword = createToken({ name: 'ReturnsKeyword', pattern: /returns/, longer_alt: ID });
const HiddenKeyword = createToken({ name: 'HiddenKeyword', pattern: /hidden/, longer_alt: ID });
const ImportKeyword = createToken({ name: 'ImportKeyword', pattern: /import/, longer_alt: ID });
const FalseKeyword = createToken({ name: 'FalseKeyword', pattern: /false/, longer_alt: ID });
const EnumKeyword = createToken({ name: 'EnumKeyword', pattern: /enum/, longer_alt: ID });
const TrueKeyword = createToken({ name: 'TrueKeyword', pattern: /true/, longer_alt: ID });
const WithKeyword = createToken({ name: 'WithKeyword', pattern: /with/, longer_alt: ID });
const DashMoreThanKeyword = createToken({ name: 'DashMoreThanKeyword', pattern: /->/, longer_alt: ID });
const QuestionMarkEqualsKeyword = createToken({ name: 'QuestionMarkEqualsKeyword', pattern: /\?=/, longer_alt: ID });
const DotDotKeyword = createToken({ name: 'DotDotKeyword', pattern: /\.\./, longer_alt: ID });
const PlusEqualsKeyword = createToken({ name: 'PlusEqualsKeyword', pattern: /\+=/, longer_alt: ID });
const EqualsMoreThanKeyword = createToken({ name: 'EqualsMoreThanKeyword', pattern: /=>/, longer_alt: ID });
const AsKeyword = createToken({ name: 'AsKeyword', pattern: /as/, longer_alt: ID });
const CommaKeyword = createToken({ name: 'CommaKeyword', pattern: /,/, longer_alt: ID });
const SemicolonKeyword = createToken({ name: 'SemicolonKeyword', pattern: /;/, longer_alt: ID });
const ColonKeyword = createToken({ name: 'ColonKeyword', pattern: /:/, longer_alt: ID });
const ExclamationMarkKeyword = createToken({ name: 'ExclamationMarkKeyword', pattern: /!/, longer_alt: ID });
const QuestionMarkKeyword = createToken({ name: 'QuestionMarkKeyword', pattern: /\?/, longer_alt: QuestionMarkEqualsKeyword });
const DotKeyword = createToken({ name: 'DotKeyword', pattern: /\./, longer_alt: DotDotKeyword });
const ParenthesisOpenKeyword = createToken({ name: 'ParenthesisOpenKeyword', pattern: /\(/, longer_alt: ID });
const ParenthesisCloseKeyword = createToken({ name: 'ParenthesisCloseKeyword', pattern: /\)/, longer_alt: ID });
const BracketOpenKeyword = createToken({ name: 'BracketOpenKeyword', pattern: /\[/, longer_alt: ID });
const BracketCloseKeyword = createToken({ name: 'BracketCloseKeyword', pattern: /\]/, longer_alt: ID });
const CurlyOpenKeyword = createToken({ name: 'CurlyOpenKeyword', pattern: /\{/, longer_alt: ID });
const CurlyCloseKeyword = createToken({ name: 'CurlyCloseKeyword', pattern: /\}/, longer_alt: ID });
const AtKeyword = createToken({ name: 'AtKeyword', pattern: /@/, longer_alt: ID });
const AsteriskKeyword = createToken({ name: 'AsteriskKeyword', pattern: /\*/, longer_alt: ID });
const AmpersandKeyword = createToken({ name: 'AmpersandKeyword', pattern: /&/, longer_alt: ID });
const PlusKeyword = createToken({ name: 'PlusKeyword', pattern: /\+/, longer_alt: PlusEqualsKeyword });
const LessThanKeyword = createToken({ name: 'LessThanKeyword', pattern: /</, longer_alt: ID });
const EqualsKeyword = createToken({ name: 'EqualsKeyword', pattern: /=/, longer_alt: EqualsMoreThanKeyword });
const MoreThanKeyword = createToken({ name: 'MoreThanKeyword', pattern: />/, longer_alt: ID });
const PipeKeyword = createToken({ name: 'PipeKeyword', pattern: /\|/, longer_alt: ID });

DashMoreThanKeyword.LABEL = "'->'";
CommaKeyword.LABEL = "','";
SemicolonKeyword.LABEL = "';'";
ColonKeyword.LABEL = "':'";
ExclamationMarkKeyword.LABEL = "'!'";
QuestionMarkKeyword.LABEL = "'?'";
QuestionMarkEqualsKeyword.LABEL = "'?='";
DotDotKeyword.LABEL = "'..'";
DotKeyword.LABEL = "'.'";
ParenthesisOpenKeyword.LABEL = "'('";
ParenthesisCloseKeyword.LABEL = "')'";
BracketOpenKeyword.LABEL = "'['";
BracketCloseKeyword.LABEL = "']'";
CurlyOpenKeyword.LABEL = "'{'";
CurlyCloseKeyword.LABEL = "'}'";
AtKeyword.LABEL = "'@'";
AsteriskKeyword.LABEL = "'*'";
AmpersandKeyword.LABEL = "'&'";
PlusKeyword.LABEL = "'+'";
PlusEqualsKeyword.LABEL = "'+='";
LessThanKeyword.LABEL = "'<'";
EqualsKeyword.LABEL = "'='";
EqualsMoreThanKeyword.LABEL = "'=>'";
MoreThanKeyword.LABEL = "'>'";
PipeKeyword.LABEL = "'|'";
AsKeyword.LABEL = "'as'";
CurrentKeyword.LABEL = "'current'";
EnumKeyword.LABEL = "'enum'";
FalseKeyword.LABEL = "'false'";
FragmentKeyword.LABEL = "'fragment'";
GenerateKeyword.LABEL = "'generate'";
GrammarKeyword.LABEL = "'grammar'";
HiddenKeyword.LABEL = "'hidden'";
ImportKeyword.LABEL = "'import'";
ReturnsKeyword.LABEL = "'returns'";
TerminalKeyword.LABEL = "'terminal'";
TrueKeyword.LABEL = "'true'";
WithKeyword.LABEL = "'with'";
const tokens = [FragmentKeyword, GenerateKeyword, TerminalKeyword, CurrentKeyword, GrammarKeyword, ReturnsKeyword, HiddenKeyword, ImportKeyword, FalseKeyword, EnumKeyword, TrueKeyword, WithKeyword, DashMoreThanKeyword, QuestionMarkEqualsKeyword, DotDotKeyword, PlusEqualsKeyword, EqualsMoreThanKeyword, AsKeyword, CommaKeyword, SemicolonKeyword, ColonKeyword, ExclamationMarkKeyword, QuestionMarkKeyword, DotKeyword, ParenthesisOpenKeyword, ParenthesisCloseKeyword, BracketOpenKeyword, BracketCloseKeyword, CurlyOpenKeyword, CurlyCloseKeyword, AtKeyword, AsteriskKeyword, AmpersandKeyword, PlusKeyword, LessThanKeyword, EqualsKeyword, MoreThanKeyword, PipeKeyword, ID, INT, RegexLiteral, string, WS];

export class Parser extends LangiumParser {
    readonly grammarAccess: LangiumGrammarGrammarAccess;

    constructor(services: LangiumServices) {
        super(tokens, services);
    }

    Grammar = this.MAIN_RULE("Grammar", Grammar, () => {
        this.initializeElement(this.grammarAccess.Grammar);
        this.consume(1, GrammarKeyword, this.grammarAccess.Grammar.GrammarKeyword);
        this.consume(2, ID, this.grammarAccess.Grammar.nameIDRuleCall);
        this.option(1, () => {
            this.consume(3, WithKeyword, this.grammarAccess.Grammar.WithKeyword);
            this.consume(4, ID, this.grammarAccess.Grammar.usedGrammarsGrammarCrossReference);
            this.many(1, () => {
                this.consume(5, CommaKeyword, this.grammarAccess.Grammar.CommaKeyword);
                this.consume(6, ID, this.grammarAccess.Grammar.usedGrammarsGrammarCrossReference);
            });
        });
        this.option(3, () => {
            this.consume(7, HiddenKeyword, this.grammarAccess.Grammar.HiddenKeyword);
            this.consume(8, ParenthesisOpenKeyword, this.grammarAccess.Grammar.ParenthesisOpenKeyword);
            this.option(2, () => {
                this.consume(9, ID, this.grammarAccess.Grammar.hiddenTokensAbstractRuleCrossReference);
                this.many(2, () => {
                    this.consume(10, CommaKeyword, this.grammarAccess.Grammar.CommaKeyword);
                    this.consume(11, ID, this.grammarAccess.Grammar.hiddenTokensAbstractRuleCrossReference);
                });
            });
            this.consume(12, ParenthesisCloseKeyword, this.grammarAccess.Grammar.ParenthesisCloseKeyword);
        });
        this.many(3, () => {
            this.subrule(1, this.AbstractMetamodelDeclaration, this.grammarAccess.Grammar.metamodelDeclarationsAbstractMetamodelDeclarationRuleCall);
        });
        this.many(4, () => {
            this.subrule(2, this.AbstractRule, this.grammarAccess.Grammar.rulesAbstractRuleRuleCall);
        });
        return this.construct();
    });

    AbstractRule = this.DEFINE_RULE("AbstractRule", AbstractRule, () => {
        this.initializeElement(this.grammarAccess.AbstractRule);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.ParserRule, this.grammarAccess.AbstractRule.ParserRuleRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.TerminalRule, this.grammarAccess.AbstractRule.TerminalRuleRuleCall);
            },
            () => {
                this.unassignedSubrule(3, this.EnumRule, this.grammarAccess.AbstractRule.EnumRuleRuleCall);
            },
        ]);
        return this.construct();
    });

    AbstractMetamodelDeclaration = this.DEFINE_RULE("AbstractMetamodelDeclaration", AbstractMetamodelDeclaration, () => {
        this.initializeElement(this.grammarAccess.AbstractMetamodelDeclaration);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.GeneratedMetamodel, this.grammarAccess.AbstractMetamodelDeclaration.GeneratedMetamodelRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.ReferencedMetamodel, this.grammarAccess.AbstractMetamodelDeclaration.ReferencedMetamodelRuleCall);
            },
        ]);
        return this.construct();
    });

    GeneratedMetamodel = this.DEFINE_RULE("GeneratedMetamodel", GeneratedMetamodel, () => {
        this.initializeElement(this.grammarAccess.GeneratedMetamodel);
        this.consume(1, GenerateKeyword, this.grammarAccess.GeneratedMetamodel.GenerateKeyword);
        this.consume(2, ID, this.grammarAccess.GeneratedMetamodel.nameIDRuleCall);
        this.consume(3, string, this.grammarAccess.GeneratedMetamodel.ePackagestringRuleCall);
        this.option(1, () => {
            this.consume(4, AsKeyword, this.grammarAccess.GeneratedMetamodel.AsKeyword);
            this.consume(5, ID, this.grammarAccess.GeneratedMetamodel.aliasIDRuleCall);
        });
        return this.construct();
    });

    ReferencedMetamodel = this.DEFINE_RULE("ReferencedMetamodel", ReferencedMetamodel, () => {
        this.initializeElement(this.grammarAccess.ReferencedMetamodel);
        this.consume(1, ImportKeyword, this.grammarAccess.ReferencedMetamodel.ImportKeyword);
        this.consume(2, string, this.grammarAccess.ReferencedMetamodel.ePackagestringRuleCall);
        this.option(1, () => {
            this.consume(3, AsKeyword, this.grammarAccess.ReferencedMetamodel.AsKeyword);
            this.consume(4, ID, this.grammarAccess.ReferencedMetamodel.aliasIDRuleCall);
        });
        return this.construct();
    });

    Annotation = this.DEFINE_RULE("Annotation", Annotation, () => {
        this.initializeElement(this.grammarAccess.Annotation);
        this.consume(1, AtKeyword, this.grammarAccess.Annotation.AtKeyword);
        this.consume(2, ID, this.grammarAccess.Annotation.nameIDRuleCall);
        return this.construct();
    });

    ParserRule = this.DEFINE_RULE("ParserRule", ParserRule, () => {
        this.initializeElement(this.grammarAccess.ParserRule);
        this.or(1, [
            () => {
                this.consume(1, FragmentKeyword, this.grammarAccess.ParserRule.FragmentKeyword);
                this.unassignedSubrule(1, this.RuleNameAndParams, this.grammarAccess.ParserRule.RuleNameAndParamsRuleCall);
                this.or(2, [
                    () => {
                        this.consume(2, AsteriskKeyword, this.grammarAccess.ParserRule.AsteriskKeyword);
                    },
                    () => {
                        this.option(1, () => {
                            this.consume(3, ReturnsKeyword, this.grammarAccess.ParserRule.ReturnsKeyword);
                            this.consume(4, ID, this.grammarAccess.ParserRule.typeIDRuleCall);
                        });
                    },
                ]);
            },
            () => {
                this.unassignedSubrule(2, this.RuleNameAndParams, this.grammarAccess.ParserRule.RuleNameAndParamsRuleCall);
                this.option(2, () => {
                    this.consume(5, ReturnsKeyword, this.grammarAccess.ParserRule.ReturnsKeyword);
                    this.consume(6, ID, this.grammarAccess.ParserRule.typeIDRuleCall);
                });
            },
        ]);
        this.option(4, () => {
            this.consume(7, HiddenKeyword, this.grammarAccess.ParserRule.HiddenKeyword);
            this.consume(8, ParenthesisOpenKeyword, this.grammarAccess.ParserRule.ParenthesisOpenKeyword);
            this.option(3, () => {
                this.consume(9, ID, this.grammarAccess.ParserRule.hiddenTokensAbstractRuleCrossReference);
                this.many(1, () => {
                    this.consume(10, CommaKeyword, this.grammarAccess.ParserRule.CommaKeyword);
                    this.consume(11, ID, this.grammarAccess.ParserRule.hiddenTokensAbstractRuleCrossReference);
                });
            });
            this.consume(12, ParenthesisCloseKeyword, this.grammarAccess.ParserRule.ParenthesisCloseKeyword);
        });
        this.consume(13, ColonKeyword, this.grammarAccess.ParserRule.ColonKeyword);
        this.subrule(3, this.Alternatives, this.grammarAccess.ParserRule.alternativesAlternativesRuleCall);
        this.consume(14, SemicolonKeyword, this.grammarAccess.ParserRule.SemicolonKeyword);
        return this.construct();
    });

    RuleNameAndParams = this.DEFINE_RULE("RuleNameAndParams", undefined, () => {
        this.initializeElement(this.grammarAccess.RuleNameAndParams);
        this.consume(1, ID, this.grammarAccess.RuleNameAndParams.nameIDRuleCall);
        this.option(2, () => {
            this.consume(2, LessThanKeyword, this.grammarAccess.RuleNameAndParams.LessThanKeyword);
            this.option(1, () => {
                this.subrule(1, this.Parameter, this.grammarAccess.RuleNameAndParams.parametersParameterRuleCall);
                this.many(1, () => {
                    this.consume(3, CommaKeyword, this.grammarAccess.RuleNameAndParams.CommaKeyword);
                    this.subrule(2, this.Parameter, this.grammarAccess.RuleNameAndParams.parametersParameterRuleCall);
                });
            });
            this.consume(4, MoreThanKeyword, this.grammarAccess.RuleNameAndParams.MoreThanKeyword);
        });
        return this.construct();
    });

    Parameter = this.DEFINE_RULE("Parameter", Parameter, () => {
        this.initializeElement(this.grammarAccess.Parameter);
        this.consume(1, ID, this.grammarAccess.Parameter.nameIDRuleCall);
        return this.construct();
    });

    Alternatives = this.DEFINE_RULE("Alternatives", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.Alternatives);
        this.unassignedSubrule(1, this.UnorderedGroup, this.grammarAccess.Alternatives.UnorderedGroupRuleCall);
        this.many(1, () => {
            this.action(Alternatives, this.grammarAccess.Alternatives.AlternativeselementsAction);
            this.consume(1, PipeKeyword, this.grammarAccess.Alternatives.PipeKeyword);
            this.subrule(2, this.UnorderedGroup, this.grammarAccess.Alternatives.elementsUnorderedGroupRuleCall);
        });
        return this.construct();
    });

    UnorderedGroup = this.DEFINE_RULE("UnorderedGroup", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.UnorderedGroup);
        this.unassignedSubrule(1, this.Group, this.grammarAccess.UnorderedGroup.GroupRuleCall);
        this.many(1, () => {
            this.action(UnorderedGroup, this.grammarAccess.UnorderedGroup.UnorderedGroupelementsAction);
            this.consume(1, AmpersandKeyword, this.grammarAccess.UnorderedGroup.AmpersandKeyword);
            this.subrule(2, this.Group, this.grammarAccess.UnorderedGroup.elementsGroupRuleCall);
        });
        return this.construct();
    });

    Group = this.DEFINE_RULE("Group", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.Group);
        this.unassignedSubrule(1, this.AbstractToken, this.grammarAccess.Group.AbstractTokenRuleCall);
        this.many(1, () => {
            this.action(Group, this.grammarAccess.Group.GroupelementsAction);
            this.subrule(2, this.AbstractToken, this.grammarAccess.Group.elementsAbstractTokenRuleCall);
        });
        return this.construct();
    });

    AbstractToken = this.DEFINE_RULE("AbstractToken", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.AbstractToken);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.AbstractTokenWithCardinality, this.grammarAccess.AbstractToken.AbstractTokenWithCardinalityRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.Action, this.grammarAccess.AbstractToken.ActionRuleCall);
            },
        ]);
        return this.construct();
    });

    AbstractTokenWithCardinality = this.DEFINE_RULE("AbstractTokenWithCardinality", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.AbstractTokenWithCardinality);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.Assignment, this.grammarAccess.AbstractTokenWithCardinality.AssignmentRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.AbstractTerminal, this.grammarAccess.AbstractTokenWithCardinality.AbstractTerminalRuleCall);
            },
        ]);
        this.option(1, () => {
            this.or(2, [
                () => {
                    this.consume(1, QuestionMarkKeyword, this.grammarAccess.AbstractTokenWithCardinality.QuestionMarkKeyword);
                },
                () => {
                    this.consume(2, AsteriskKeyword, this.grammarAccess.AbstractTokenWithCardinality.AsteriskKeyword);
                },
                () => {
                    this.consume(3, PlusKeyword, this.grammarAccess.AbstractTokenWithCardinality.PlusKeyword);
                },
            ]);
        });
        return this.construct();
    });

    Action = this.DEFINE_RULE("Action", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.Action);
        this.action(Action, this.grammarAccess.Action.ActionAction);
        this.consume(1, CurlyOpenKeyword, this.grammarAccess.Action.CurlyOpenKeyword);
        this.consume(2, ID, this.grammarAccess.Action.typeIDRuleCall);
        this.option(1, () => {
            this.consume(3, DotKeyword, this.grammarAccess.Action.DotKeyword);
            this.consume(4, ID, this.grammarAccess.Action.featureIDRuleCall);
            this.or(1, [
                () => {
                    this.consume(5, EqualsKeyword, this.grammarAccess.Action.EqualsKeyword);
                },
                () => {
                    this.consume(6, PlusEqualsKeyword, this.grammarAccess.Action.PlusEqualsKeyword);
                },
            ]);
            this.consume(7, CurrentKeyword, this.grammarAccess.Action.CurrentKeyword);
        });
        this.consume(8, CurlyCloseKeyword, this.grammarAccess.Action.CurlyCloseKeyword);
        return this.construct();
    });

    AbstractTerminal = this.DEFINE_RULE("AbstractTerminal", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.AbstractTerminal);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.Keyword, this.grammarAccess.AbstractTerminal.KeywordRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.RuleCall, this.grammarAccess.AbstractTerminal.RuleCallRuleCall);
            },
            () => {
                this.unassignedSubrule(3, this.ParenthesizedElement, this.grammarAccess.AbstractTerminal.ParenthesizedElementRuleCall);
            },
            () => {
                this.unassignedSubrule(4, this.PredicatedKeyword, this.grammarAccess.AbstractTerminal.PredicatedKeywordRuleCall);
            },
            () => {
                this.unassignedSubrule(5, this.PredicatedRuleCall, this.grammarAccess.AbstractTerminal.PredicatedRuleCallRuleCall);
            },
            () => {
                this.unassignedSubrule(6, this.PredicatedGroup, this.grammarAccess.AbstractTerminal.PredicatedGroupRuleCall);
            },
        ]);
        return this.construct();
    });

    Keyword = this.DEFINE_RULE("Keyword", Keyword, () => {
        this.initializeElement(this.grammarAccess.Keyword);
        this.consume(1, string, this.grammarAccess.Keyword.valuestringRuleCall);
        return this.construct();
    });

    RuleCall = this.DEFINE_RULE("RuleCall", RuleCall, () => {
        this.initializeElement(this.grammarAccess.RuleCall);
        this.consume(1, ID, this.grammarAccess.RuleCall.ruleAbstractRuleCrossReference);
        this.option(1, () => {
            this.consume(2, LessThanKeyword, this.grammarAccess.RuleCall.LessThanKeyword);
            this.subrule(1, this.NamedArgument, this.grammarAccess.RuleCall.argumentsNamedArgumentRuleCall);
            this.many(1, () => {
                this.consume(3, CommaKeyword, this.grammarAccess.RuleCall.CommaKeyword);
                this.subrule(2, this.NamedArgument, this.grammarAccess.RuleCall.argumentsNamedArgumentRuleCall);
            });
            this.consume(4, MoreThanKeyword, this.grammarAccess.RuleCall.MoreThanKeyword);
        });
        return this.construct();
    });

    NamedArgument = this.DEFINE_RULE("NamedArgument", NamedArgument, () => {
        this.initializeElement(this.grammarAccess.NamedArgument);
        this.option(1, () => {
            this.consume(1, ID, this.grammarAccess.NamedArgument.parameterParameterCrossReference);
            this.consume(2, EqualsKeyword, this.grammarAccess.NamedArgument.EqualsKeyword);
        });
        this.subrule(1, this.Disjunction, this.grammarAccess.NamedArgument.valueDisjunctionRuleCall);
        return this.construct();
    });

    LiteralCondition = this.DEFINE_RULE("LiteralCondition", LiteralCondition, () => {
        this.initializeElement(this.grammarAccess.LiteralCondition);
        this.or(1, [
            () => {
                this.consume(1, TrueKeyword, this.grammarAccess.LiteralCondition.TrueKeyword);
            },
            () => {
                this.consume(2, FalseKeyword, this.grammarAccess.LiteralCondition.FalseKeyword);
            },
        ]);
        return this.construct();
    });

    Disjunction = this.DEFINE_RULE("Disjunction", Condition, () => {
        this.initializeElement(this.grammarAccess.Disjunction);
        this.unassignedSubrule(1, this.Conjunction, this.grammarAccess.Disjunction.ConjunctionRuleCall);
        this.option(1, () => {
            this.action(Disjunction, this.grammarAccess.Disjunction.DisjunctionleftAction);
            this.consume(1, PipeKeyword, this.grammarAccess.Disjunction.PipeKeyword);
            this.subrule(2, this.Conjunction, this.grammarAccess.Disjunction.rightConjunctionRuleCall);
        });
        return this.construct();
    });

    Conjunction = this.DEFINE_RULE("Conjunction", Condition, () => {
        this.initializeElement(this.grammarAccess.Conjunction);
        this.unassignedSubrule(1, this.Negation, this.grammarAccess.Conjunction.NegationRuleCall);
        this.option(1, () => {
            this.action(Conjunction, this.grammarAccess.Conjunction.ConjunctionleftAction);
            this.consume(1, AmpersandKeyword, this.grammarAccess.Conjunction.AmpersandKeyword);
            this.subrule(2, this.Negation, this.grammarAccess.Conjunction.rightNegationRuleCall);
        });
        return this.construct();
    });

    Negation = this.DEFINE_RULE("Negation", Condition, () => {
        this.initializeElement(this.grammarAccess.Negation);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.Atom, this.grammarAccess.Negation.AtomRuleCall);
            },
            () => {
                this.action(Negation, this.grammarAccess.Negation.NegationAction);
                this.consume(1, ExclamationMarkKeyword, this.grammarAccess.Negation.ExclamationMarkKeyword);
                this.subrule(2, this.Negation, this.grammarAccess.Negation.valueNegationRuleCall);
            },
        ]);
        return this.construct();
    });

    Atom = this.DEFINE_RULE("Atom", Condition, () => {
        this.initializeElement(this.grammarAccess.Atom);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.ParameterReference, this.grammarAccess.Atom.ParameterReferenceRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.ParenthesizedCondition, this.grammarAccess.Atom.ParenthesizedConditionRuleCall);
            },
            () => {
                this.unassignedSubrule(3, this.LiteralCondition, this.grammarAccess.Atom.LiteralConditionRuleCall);
            },
        ]);
        return this.construct();
    });

    ParenthesizedCondition = this.DEFINE_RULE("ParenthesizedCondition", Condition, () => {
        this.initializeElement(this.grammarAccess.ParenthesizedCondition);
        this.consume(1, ParenthesisOpenKeyword, this.grammarAccess.ParenthesizedCondition.ParenthesisOpenKeyword);
        this.unassignedSubrule(1, this.Disjunction, this.grammarAccess.ParenthesizedCondition.DisjunctionRuleCall);
        this.consume(2, ParenthesisCloseKeyword, this.grammarAccess.ParenthesizedCondition.ParenthesisCloseKeyword);
        return this.construct();
    });

    ParameterReference = this.DEFINE_RULE("ParameterReference", ParameterReference, () => {
        this.initializeElement(this.grammarAccess.ParameterReference);
        this.consume(1, ID, this.grammarAccess.ParameterReference.parameterParameterCrossReference);
        return this.construct();
    });

    TerminalRuleCall = this.DEFINE_RULE("TerminalRuleCall", TerminalRuleCall, () => {
        this.initializeElement(this.grammarAccess.TerminalRuleCall);
        this.consume(1, ID, this.grammarAccess.TerminalRuleCall.ruleAbstractRuleCrossReference);
        return this.construct();
    });

    PredicatedKeyword = this.DEFINE_RULE("PredicatedKeyword", Keyword, () => {
        this.initializeElement(this.grammarAccess.PredicatedKeyword);
        this.or(1, [
            () => {
                this.consume(1, EqualsMoreThanKeyword, this.grammarAccess.PredicatedKeyword.EqualsMoreThanKeyword);
            },
            () => {
                this.consume(2, DashMoreThanKeyword, this.grammarAccess.PredicatedKeyword.DashMoreThanKeyword);
            },
        ]);
        this.consume(3, string, this.grammarAccess.PredicatedKeyword.valuestringRuleCall);
        return this.construct();
    });

    PredicatedRuleCall = this.DEFINE_RULE("PredicatedRuleCall", RuleCall, () => {
        this.initializeElement(this.grammarAccess.PredicatedRuleCall);
        this.or(1, [
            () => {
                this.consume(1, EqualsMoreThanKeyword, this.grammarAccess.PredicatedRuleCall.EqualsMoreThanKeyword);
            },
            () => {
                this.consume(2, DashMoreThanKeyword, this.grammarAccess.PredicatedRuleCall.DashMoreThanKeyword);
            },
        ]);
        this.consume(3, ID, this.grammarAccess.PredicatedRuleCall.ruleAbstractRuleCrossReference);
        this.option(1, () => {
            this.consume(4, LessThanKeyword, this.grammarAccess.PredicatedRuleCall.LessThanKeyword);
            this.subrule(1, this.NamedArgument, this.grammarAccess.PredicatedRuleCall.argumentsNamedArgumentRuleCall);
            this.many(1, () => {
                this.consume(5, CommaKeyword, this.grammarAccess.PredicatedRuleCall.CommaKeyword);
                this.subrule(2, this.NamedArgument, this.grammarAccess.PredicatedRuleCall.argumentsNamedArgumentRuleCall);
            });
            this.consume(6, MoreThanKeyword, this.grammarAccess.PredicatedRuleCall.MoreThanKeyword);
        });
        return this.construct();
    });

    Assignment = this.DEFINE_RULE("Assignment", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.Assignment);
        this.action(Assignment, this.grammarAccess.Assignment.AssignmentAction);
        this.option(1, () => {
            this.or(1, [
                () => {
                    this.consume(1, EqualsMoreThanKeyword, this.grammarAccess.Assignment.EqualsMoreThanKeyword);
                },
                () => {
                    this.consume(2, DashMoreThanKeyword, this.grammarAccess.Assignment.DashMoreThanKeyword);
                },
            ]);
        });
        this.consume(3, ID, this.grammarAccess.Assignment.featureIDRuleCall);
        this.or(2, [
            () => {
                this.consume(4, PlusEqualsKeyword, this.grammarAccess.Assignment.PlusEqualsKeyword);
            },
            () => {
                this.consume(5, EqualsKeyword, this.grammarAccess.Assignment.EqualsKeyword);
            },
            () => {
                this.consume(6, QuestionMarkEqualsKeyword, this.grammarAccess.Assignment.QuestionMarkEqualsKeyword);
            },
        ]);
        this.subrule(1, this.AssignableTerminal, this.grammarAccess.Assignment.terminalAssignableTerminalRuleCall);
        return this.construct();
    });

    AssignableTerminal = this.DEFINE_RULE("AssignableTerminal", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.AssignableTerminal);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.Keyword, this.grammarAccess.AssignableTerminal.KeywordRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.RuleCall, this.grammarAccess.AssignableTerminal.RuleCallRuleCall);
            },
            () => {
                this.unassignedSubrule(3, this.ParenthesizedAssignableElement, this.grammarAccess.AssignableTerminal.ParenthesizedAssignableElementRuleCall);
            },
            () => {
                this.unassignedSubrule(4, this.CrossReference, this.grammarAccess.AssignableTerminal.CrossReferenceRuleCall);
            },
        ]);
        return this.construct();
    });

    ParenthesizedAssignableElement = this.DEFINE_RULE("ParenthesizedAssignableElement", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.ParenthesizedAssignableElement);
        this.consume(1, ParenthesisOpenKeyword, this.grammarAccess.ParenthesizedAssignableElement.ParenthesisOpenKeyword);
        this.unassignedSubrule(1, this.AssignableAlternatives, this.grammarAccess.ParenthesizedAssignableElement.AssignableAlternativesRuleCall);
        this.consume(2, ParenthesisCloseKeyword, this.grammarAccess.ParenthesizedAssignableElement.ParenthesisCloseKeyword);
        return this.construct();
    });

    AssignableAlternatives = this.DEFINE_RULE("AssignableAlternatives", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.AssignableAlternatives);
        this.unassignedSubrule(1, this.AssignableTerminal, this.grammarAccess.AssignableAlternatives.AssignableTerminalRuleCall);
        this.option(1, () => {
            this.action(Alternatives, this.grammarAccess.AssignableAlternatives.AlternativeselementsAction);
            this.many(1, () => {
                this.consume(1, PipeKeyword, this.grammarAccess.AssignableAlternatives.PipeKeyword);
                this.subrule(2, this.AssignableTerminal, this.grammarAccess.AssignableAlternatives.elementsAssignableTerminalRuleCall);
            });
        });
        return this.construct();
    });

    CrossReference = this.DEFINE_RULE("CrossReference", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.CrossReference);
        this.action(CrossReference, this.grammarAccess.CrossReference.CrossReferenceAction);
        this.consume(1, BracketOpenKeyword, this.grammarAccess.CrossReference.BracketOpenKeyword);
        this.consume(2, ID, this.grammarAccess.CrossReference.typeParserRuleCrossReference);
        this.option(1, () => {
            this.consume(3, PipeKeyword, this.grammarAccess.CrossReference.PipeKeyword);
            this.subrule(1, this.CrossReferenceableTerminal, this.grammarAccess.CrossReference.terminalCrossReferenceableTerminalRuleCall);
        });
        this.consume(4, BracketCloseKeyword, this.grammarAccess.CrossReference.BracketCloseKeyword);
        return this.construct();
    });

    CrossReferenceableTerminal = this.DEFINE_RULE("CrossReferenceableTerminal", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.CrossReferenceableTerminal);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.Keyword, this.grammarAccess.CrossReferenceableTerminal.KeywordRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.RuleCall, this.grammarAccess.CrossReferenceableTerminal.RuleCallRuleCall);
            },
        ]);
        return this.construct();
    });

    ParenthesizedElement = this.DEFINE_RULE("ParenthesizedElement", AbstractElement, () => {
        this.initializeElement(this.grammarAccess.ParenthesizedElement);
        this.consume(1, ParenthesisOpenKeyword, this.grammarAccess.ParenthesizedElement.ParenthesisOpenKeyword);
        this.unassignedSubrule(1, this.Alternatives, this.grammarAccess.ParenthesizedElement.AlternativesRuleCall);
        this.consume(2, ParenthesisCloseKeyword, this.grammarAccess.ParenthesizedElement.ParenthesisCloseKeyword);
        return this.construct();
    });

    PredicatedGroup = this.DEFINE_RULE("PredicatedGroup", Group, () => {
        this.initializeElement(this.grammarAccess.PredicatedGroup);
        this.or(1, [
            () => {
                this.consume(1, EqualsMoreThanKeyword, this.grammarAccess.PredicatedGroup.EqualsMoreThanKeyword);
            },
            () => {
                this.consume(2, DashMoreThanKeyword, this.grammarAccess.PredicatedGroup.DashMoreThanKeyword);
            },
        ]);
        this.consume(3, ParenthesisOpenKeyword, this.grammarAccess.PredicatedGroup.ParenthesisOpenKeyword);
        this.subrule(1, this.Alternatives, this.grammarAccess.PredicatedGroup.elementsAlternativesRuleCall);
        this.consume(4, ParenthesisCloseKeyword, this.grammarAccess.PredicatedGroup.ParenthesisCloseKeyword);
        return this.construct();
    });

    TerminalRule = this.DEFINE_RULE("TerminalRule", TerminalRule, () => {
        this.initializeElement(this.grammarAccess.TerminalRule);
        this.consume(1, TerminalKeyword, this.grammarAccess.TerminalRule.TerminalKeyword);
        this.or(1, [
            () => {
                this.consume(2, FragmentKeyword, this.grammarAccess.TerminalRule.FragmentKeyword);
                this.consume(3, ID, this.grammarAccess.TerminalRule.nameIDRuleCall);
            },
            () => {
                this.consume(4, ID, this.grammarAccess.TerminalRule.nameIDRuleCall);
                this.option(1, () => {
                    this.consume(5, ReturnsKeyword, this.grammarAccess.TerminalRule.ReturnsKeyword);
                    this.consume(6, ID, this.grammarAccess.TerminalRule.typeIDRuleCall);
                });
            },
        ]);
        this.consume(7, ColonKeyword, this.grammarAccess.TerminalRule.ColonKeyword);
        this.consume(8, RegexLiteral, this.grammarAccess.TerminalRule.regexRegexLiteralRuleCall);
        this.consume(9, SemicolonKeyword, this.grammarAccess.TerminalRule.SemicolonKeyword);
        return this.construct();
    });

    TerminalAlternatives = this.DEFINE_RULE("TerminalAlternatives", TerminalAlternatives, () => {
        this.initializeElement(this.grammarAccess.TerminalAlternatives);
        this.unassignedSubrule(1, this.TerminalGroup, this.grammarAccess.TerminalAlternatives.TerminalGroupRuleCall);
        this.many(1, () => {
            this.action(TerminalAlternatives, this.grammarAccess.TerminalAlternatives.TerminalAlternativeselementsAction);
            this.consume(1, PipeKeyword, this.grammarAccess.TerminalAlternatives.PipeKeyword);
            this.subrule(2, this.TerminalGroup, this.grammarAccess.TerminalAlternatives.elementsTerminalGroupRuleCall);
        });
        return this.construct();
    });

    TerminalGroup = this.DEFINE_RULE("TerminalGroup", TerminalGroup, () => {
        this.initializeElement(this.grammarAccess.TerminalGroup);
        this.many(1, () => {
            this.subrule(1, this.TerminalToken, this.grammarAccess.TerminalGroup.elementsTerminalTokenRuleCall);
        });
        return this.construct();
    });

    TerminalToken = this.DEFINE_RULE("TerminalToken", TerminalToken, () => {
        this.initializeElement(this.grammarAccess.TerminalToken);
        this.unassignedSubrule(1, this.TerminalTokenElement, this.grammarAccess.TerminalToken.TerminalTokenElementRuleCall);
        this.option(1, () => {
            this.or(1, [
                () => {
                    this.consume(1, QuestionMarkKeyword, this.grammarAccess.TerminalToken.QuestionMarkKeyword);
                },
                () => {
                    this.consume(2, AsteriskKeyword, this.grammarAccess.TerminalToken.AsteriskKeyword);
                },
                () => {
                    this.consume(3, PlusKeyword, this.grammarAccess.TerminalToken.PlusKeyword);
                },
            ]);
        });
        return this.construct();
    });

    TerminalTokenElement = this.DEFINE_RULE("TerminalTokenElement", TerminalTokenElement, () => {
        this.initializeElement(this.grammarAccess.TerminalTokenElement);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.CharacterRange, this.grammarAccess.TerminalTokenElement.CharacterRangeRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.TerminalRuleCall, this.grammarAccess.TerminalTokenElement.TerminalRuleCallRuleCall);
            },
            () => {
                this.unassignedSubrule(3, this.ParenthesizedTerminalElement, this.grammarAccess.TerminalTokenElement.ParenthesizedTerminalElementRuleCall);
            },
            () => {
                this.unassignedSubrule(4, this.AbstractNegatedToken, this.grammarAccess.TerminalTokenElement.AbstractNegatedTokenRuleCall);
            },
            () => {
                this.unassignedSubrule(5, this.Wildcard, this.grammarAccess.TerminalTokenElement.WildcardRuleCall);
            },
        ]);
        return this.construct();
    });

    ParenthesizedTerminalElement = this.DEFINE_RULE("ParenthesizedTerminalElement", TerminalAlternatives, () => {
        this.initializeElement(this.grammarAccess.ParenthesizedTerminalElement);
        this.consume(1, ParenthesisOpenKeyword, this.grammarAccess.ParenthesizedTerminalElement.ParenthesisOpenKeyword);
        this.unassignedSubrule(1, this.TerminalAlternatives, this.grammarAccess.ParenthesizedTerminalElement.TerminalAlternativesRuleCall);
        this.consume(2, ParenthesisCloseKeyword, this.grammarAccess.ParenthesizedTerminalElement.ParenthesisCloseKeyword);
        return this.construct();
    });

    AbstractNegatedToken = this.DEFINE_RULE("AbstractNegatedToken", AbstractNegatedToken, () => {
        this.initializeElement(this.grammarAccess.AbstractNegatedToken);
        this.or(1, [
            () => {
                this.unassignedSubrule(1, this.NegatedToken, this.grammarAccess.AbstractNegatedToken.NegatedTokenRuleCall);
            },
            () => {
                this.unassignedSubrule(2, this.UntilToken, this.grammarAccess.AbstractNegatedToken.UntilTokenRuleCall);
            },
        ]);
        return this.construct();
    });

    NegatedToken = this.DEFINE_RULE("NegatedToken", NegatedToken, () => {
        this.initializeElement(this.grammarAccess.NegatedToken);
        this.consume(1, ExclamationMarkKeyword, this.grammarAccess.NegatedToken.ExclamationMarkKeyword);
        this.subrule(1, this.TerminalTokenElement, this.grammarAccess.NegatedToken.terminalTerminalTokenElementRuleCall);
        return this.construct();
    });

    UntilToken = this.DEFINE_RULE("UntilToken", UntilToken, () => {
        this.initializeElement(this.grammarAccess.UntilToken);
        this.consume(1, DashMoreThanKeyword, this.grammarAccess.UntilToken.DashMoreThanKeyword);
        this.subrule(1, this.TerminalTokenElement, this.grammarAccess.UntilToken.terminalTerminalTokenElementRuleCall);
        return this.construct();
    });

    Wildcard = this.DEFINE_RULE("Wildcard", Wildcard, () => {
        this.initializeElement(this.grammarAccess.Wildcard);
        this.action(Wildcard, this.grammarAccess.Wildcard.WildcardAction);
        this.consume(1, DotKeyword, this.grammarAccess.Wildcard.DotKeyword);
        return this.construct();
    });

    CharacterRange = this.DEFINE_RULE("CharacterRange", CharacterRange, () => {
        this.initializeElement(this.grammarAccess.CharacterRange);
        this.subrule(1, this.Keyword, this.grammarAccess.CharacterRange.leftKeywordRuleCall);
        this.option(1, () => {
            this.consume(1, DotDotKeyword, this.grammarAccess.CharacterRange.DotDotKeyword);
            this.subrule(2, this.Keyword, this.grammarAccess.CharacterRange.rightKeywordRuleCall);
        });
        return this.construct();
    });

    EnumRule = this.DEFINE_RULE("EnumRule", EnumRule, () => {
        this.initializeElement(this.grammarAccess.EnumRule);
        this.consume(1, EnumKeyword, this.grammarAccess.EnumRule.EnumKeyword);
        this.consume(2, ID, this.grammarAccess.EnumRule.nameIDRuleCall);
        this.option(1, () => {
            this.consume(3, ReturnsKeyword, this.grammarAccess.EnumRule.ReturnsKeyword);
            this.consume(4, ID, this.grammarAccess.EnumRule.typeIDRuleCall);
        });
        this.consume(5, ColonKeyword, this.grammarAccess.EnumRule.ColonKeyword);
        this.subrule(1, this.EnumLiterals, this.grammarAccess.EnumRule.alternativesEnumLiteralsRuleCall);
        this.consume(6, SemicolonKeyword, this.grammarAccess.EnumRule.SemicolonKeyword);
        return this.construct();
    });

    EnumLiterals = this.DEFINE_RULE("EnumLiterals", EnumLiterals, () => {
        this.initializeElement(this.grammarAccess.EnumLiterals);
        this.unassignedSubrule(1, this.EnumLiteralDeclaration, this.grammarAccess.EnumLiterals.EnumLiteralDeclarationRuleCall);
        this.many(1, () => {
            this.action(EnumLiterals, this.grammarAccess.EnumLiterals.EnumLiteralselementsAction);
            this.consume(1, PipeKeyword, this.grammarAccess.EnumLiterals.PipeKeyword);
            this.subrule(2, this.EnumLiteralDeclaration, this.grammarAccess.EnumLiterals.elementsEnumLiteralDeclarationRuleCall);
        });
        return this.construct();
    });

    EnumLiteralDeclaration = this.DEFINE_RULE("EnumLiteralDeclaration", EnumLiteralDeclaration, () => {
        this.initializeElement(this.grammarAccess.EnumLiteralDeclaration);
        this.consume(1, ID, this.grammarAccess.EnumLiteralDeclaration.enumLiteralIDRuleCall);
        this.option(1, () => {
            this.consume(2, EqualsKeyword, this.grammarAccess.EnumLiteralDeclaration.EqualsKeyword);
            this.subrule(1, this.Keyword, this.grammarAccess.EnumLiteralDeclaration.literalKeywordRuleCall);
        });
        return this.construct();
    });

}
