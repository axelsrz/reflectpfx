/**
 * Represents the root of declarative Dialogs, Triggers, Templates and Bot Components.
 */
 export interface BotElement
 {
     readonly $kind: BotElementKind;
     /**
      * List of diagnostics attached to this BotElement. Only serializable in Json
      */
     diagnostics: BotElementDiagnostic[];
     /**
      * Fields that were deserialized but not understood by the model
      */
     extensionData?: RecordDataValue;
 }

 export type RecordDataValue = { [property: string]: DataValue }

/**
 * Represents a single diagnostic. Diagnostics can be attached to the bot elements.
 */
 export interface BotElementDiagnostic
 {
     readonly $kind: BotElementDiagnosticKind;
 }

/**
 * Base element representing structured condition editor elements.
 */
 export interface BooleanConditionBase extends BotElement
 {
 }


/**
 * Base element reprenting a collection of conditions.
 */
 export interface BooleanConditionGroup extends BooleanConditionBase
 {
     conditions: BooleanConditionBase[];
 }
 
 
 
 /**
  * All Conditions in this group are joined together by an AND expression
  */
 export interface AndConditionGroup extends BooleanConditionGroup
 {
     readonly $kind: BotElementKind.AndConditionGroup;
 }
 
 /**
  * Creates a `AndConditionGroup` object with the given arguments
  */
 export const makeAndConditionGroup = (value?: OmitPartial<AndConditionGroup, '$kind', 'conditions' | 'diagnostics'>): AndConditionGroup => ({
     $kind: BotElementKind.AndConditionGroup,
     conditions: [],
     diagnostics: [],
     ...value
 });
 
 
 /**
  * All Conditions in this group are joined together by an OR expression
  */
 export interface OrConditionGroup extends BooleanConditionGroup
 {
     readonly $kind: BotElementKind.OrConditionGroup;
 }
 
 /**
  * Creates a `OrConditionGroup` object with the given arguments
  */
 export const makeOrConditionGroup = (value?: OmitPartial<OrConditionGroup, '$kind', 'conditions' | 'diagnostics'>): OrConditionGroup => ({
     $kind: BotElementKind.OrConditionGroup,
     conditions: [],
     diagnostics: [],
     ...value
 });
 
 
 /**
  * Represents a single binary or unary comparison.
  */
 export interface BooleanCondition extends BooleanConditionBase
 {
     readonly $kind: BotElementKind.BooleanCondition;
     variable: PropertyPath;
     operator: BooleanConditionOperator;
     value?: ValueExpression;
 }
 
 /**
  * Creates a `BooleanCondition` object with the given arguments
  */
 export const makeBooleanCondition = (value: OmitPartial<BooleanCondition, '$kind', 'diagnostics'>): BooleanCondition => ({
     $kind: BotElementKind.BooleanCondition,
     diagnostics: [],
     ...value
 });

 /**
 * Kinds of BotElements
 */
export enum BotElementKind
{
    /**
     * Class containing the properties from the Bot entity.
     */
    BotEntity = 'BotEntity',
    CloudFlowDefinition = 'CloudFlowDefinition',
    EnvironmentVariableDefinition = 'EnvironmentVariableDefinition',
    EnvironmentVariableValue = 'EnvironmentVariableValue',
    DialogComponent = 'DialogComponent',
    /**
     * The bot component containing triggers in the main dialog.
     */
    TriggerComponent = 'TriggerComponent',
    CustomEntityComponent = 'CustomEntityComponent',
    GlobalVariableComponent = 'GlobalVariableComponent',
    SkillComponent = 'SkillComponent',
    LegacyOrUnknownComponent = 'LegacyOrUnknownComponent',
    /**
     * Root element for a complete bot, with metadata attributes about the bot, as well as its components.
     */
    BotDefinition = 'BotDefinition',
    SkillDefinition = 'SkillDefinition',
    EnvironmentVariableReference = 'EnvironmentVariableReference',
    SkillActionDefinition = 'SkillActionDefinition',
    /**
     * Regex recognizer pattern and intent definition..
     */
    RegexIntentPattern = 'RegexIntentPattern',
    /**
     * Recognizer implementation which uses regex expressions to identify intents.
     */
    RegexRecognizer = 'RegexRecognizer',
    /**
     * Recognizer implementation which uses Power Virtual Agents recognition.
     */
    VirtualAgentsRecognizer = 'VirtualAgents.Recognizer',
    Intent = 'Intent',
    /**
     * The trigger on the main dialog that was imported from Composer.
     */
    StandaloneTrigger = 'StandaloneTrigger',
    /**
     * Concrete implementation for &lt;see cref="TriggerBase"/&gt; (supports all leaf nodes being sealed).
     */
    OnCondition = 'OnCondition',
    /**
     * Concrete implementation for &lt;see cref="OnDialogEventBase" /&gt; (supports all leaf nodes being sealed).
     */
    OnDialogEvent = 'OnDialogEvent',
    /**
     * Concrete implementation for &lt;see cref="OnActivityBase" /&gt; (supports all leaf nodes being sealed).
     */
    OnActivity = 'OnActivity',
    /**
     * Actions triggered when a Command activity is received
     */
    OnCommandActivity = 'OnCommandActivity',
    /**
     * Actions triggered when an CommandResult activity is received
     */
    OnCommandResultActivity = 'OnCommandResultActivity',
    /**
     * Actions triggered when ConversationUpdateActivity is received
     */
    OnConversationUpdateActivity = 'OnConversationUpdateActivity',
    /**
     * Actions triggered when EndOfConversationActivity is received
     */
    OnEndOfConversationActivity = 'OnEndOfConversationActivity',
    /**
     * Concrete implementation for &lt;see cref="OnEventActivityBase" /&gt; (supports all leaf nodes being sealed).
     */
    OnEventActivity = 'OnEventActivity',
    /**
     * Action triggered when a conversation continues
     */
    OnContinueConversation = 'OnContinueConversation',
    /**
     * Actions triggered when a HandoffActivity is received
     */
    OnHandoffActivity = 'OnHandoffActivity',
    /**
     * Actions triggered when a InstallationUpdateActivity is received
     */
    OnInstallationUpdateActivity = 'OnInstallationUpdateActivity',
    /**
     * Actions triggered when an InvokeActivity is received
     */
    OnInvokeActivity = 'OnInvokeActivity',
    /**
     * Actions triggered when an MessageActivity is received
     */
    OnMessageActivity = 'OnMessageActivity',
    /**
     * Actions triggered when a MessageDeleteActivity is received
     */
    OnMessageDeleteActivity = 'OnMessageDeleteActivity',
    /**
     * Actions triggered when a MessageReactionActivity is received
     */
    OnMessageReactionActivity = 'OnMessageReactionActivity',
    /**
     * Actions triggered when a MessageUpdateActivity is received
     */
    OnMessageUpdateActivity = 'OnMessageUpdateActivity',
    /**
     * Actions triggered when a TypingActivity is received
     */
    OnTypingActivity = 'OnTypingActivity',
    /**
     * Triggered to assign an entity to a property
     */
    OnAssignEntity = 'OnAssignEntity',
    /**
     * Actions triggered when a dialog is started via BeginDialog()
     */
    OnBeginDialog = 'OnBeginDialog',
    /**
     * Actions triggered when an dialog was canceled
     */
    OnCancelDialog = 'OnCancelDialog',
    /**
     * Triggered to choose between different possible entity resolutions
     */
    OnChooseEntity = 'OnChooseEntity',
    /**
     * Triggered to choose which property an entity goes to
     */
    OnChooseProperty = 'OnChooseProperty',
    /**
     * Triggered when all actions and ambiguity events have been processed
     */
    OnEndOfActions = 'OnEndOfActions',
    /**
     * Actions triggered when an error event has been emitted
     */
    OnError = 'OnError',
    OnRecognizedIntent = 'OnRecognizedIntent',
    /**
     * Concrete implementation for &lt;see cref="OnIntentBase" /&gt; (supports all leaf nodes being sealed).
     */
    OnIntent = 'OnIntent',
    /**
     * Actions triggered when an Intent of "ChooseIntent" has been emitted by a recognizer
     */
    OnChooseIntent = 'OnChooseIntent',
    /**
     * Actions triggered when an RepromptDialog event is emitted
     */
    OnRepromptDialog = 'OnRepromptDialog',
    /**
     * Actions triggered when a UnknownIntent event has been emitted by the recognizer
     */
    OnUnknownIntent = 'OnUnknownIntent',
    /**
     * Trigger that handles the Greeting system dialog.
     */
    OnGreeting = 'OnGreeting',
    /**
     * Trigger that handles the Talk to Agent system dialog.
     */
    OnTalkToAgent = 'OnTalkToAgent',
    /**
     * Trigger that handles the Goodbye system dialog. Engine flushes the existing context and executes the dialog.
     */
    OnStartOver = 'OnStartOver',
    /**
     * Trigger that handles the Goodbye system dialog.
     */
    OnGoodbye = 'OnGoodbye',
    /**
     * Trigger that handles the Thankyou system dialog.
     */
    OnThankYou = 'OnThankYou',
    /**
     * Trigger that handles the End of conversation system dialog.
     */
    OnEndOfConversation = 'OnEndOfConversation',
    /**
     * Trigger that handles the end of the dialog when Bot assumes that the problem is resolved.
     */
    OnAssumedSuccess = 'OnAssumedSuccess',
    /**
     * Trigger that handles the end of the dialog when the conversation is handed over to a human agent.
     */
    OnConfirmedFailure = 'OnConfirmedFailure',
    /**
     * Trigger that handles situations when the user confirmed that Bot resolved their problem.
     */
    OnConfirmedSuccess = 'OnConfirmedSuccess',
    /**
     * Trigger that is invoked when no user input has been received during a specified duration of time
     */
    OnInactivity = 'OnInactivity',
    /**
     * Trigger that handles the Fallback logic when a user query matches no other intents.
     */
    OnFallback = 'OnFallback',
    ActionReference = 'ActionReference',
    /**
     * Representation of a variable that is stored in its own Dataverse component.
     */
    StandaloneVariable = 'StandaloneVariable',
    /**
     * Represents a variable with an initializer and a particular lifetime bound inside a dialog
     */
    Variable = 'Variable',
    /**
     * The initializer that initializes the variable via an action in the dialog.
     */
    ActionInitializer = 'ActionInitializer',
    /**
     * The initializer that initializes the variable via an action in the dialog.
     */
    ExpressionInitializer = 'ExpressionInitializer',
    /**
     * The Adaptive Dialog models conversation using events and events to adapt dynamicaly to changing conversation flow
     */
    AdaptiveDialog = 'AdaptiveDialog',
    /**
     * The action to invoke the flow with the list of arguments and assignment of results to variables.
     */
    InvokeFlowAction = 'InvokeFlowAction',
    /**
     * The action to invoke the skill with the list of arguments and assignment of results to variables.
     */
    InvokeSkillAction = 'InvokeSkillAction',
    Question = 'Question',
    /**
     * Action that asks customer to give a star (from 1 to 5) to the bot. CSAT stands for customer satisfaction score
     */
    CSATQuestion = 'CSATQuestion',
    /**
     * Input dialog which prompts the user to send a file
     */
    AttachmentInput = 'AttachmentInput',
    /**
     * ChoiceInput - Declarative input to gather choices from user
     */
    ChoiceInput = 'ChoiceInput',
    /**
     * Declarative input control that will gather yes/no confirmation input from a set of choices
     */
    ConfirmInput = 'ConfirmInput',
    /**
     * Input dialog to collect a datetime from the user
     */
    DateTimeInput = 'DateTimeInput',
    /**
     * Input dialog for asking for numbers
     */
    NumberInput = 'NumberInput',
    /**
     * OAuthInput prompts user to login
     */
    OAuthInput = 'OAuthInput',
    /**
     * Declarative text input to gather text data from users
     */
    TextInput = 'TextInput',
    /**
     * Used to provide implicitly created action scope properties.
     */
    ActionScope = 'ActionScope',
    /**
     * Cases of action scope
     */
    Case = 'Case',
    /**
     * Executes a set of actions once for each item in an in-memory list or collection
     */
    Foreach = 'Foreach',
    /**
     * Executes a set of actions once for each item in an in-memory list or collection
     */
    ForeachPage = 'ForeachPage',
    /**
     * Action which begins executing another dialog, when it is done, it will return to the caller
     */
    BeginDialog = 'BeginDialog',
    /**
     * Action which repeats the active dialog (restarting it)
     */
    RepeatDialog = 'RepeatDialog',
    /**
     * Action which calls another dialog, when it is done it will go to the callers parent dialog
     */
    ReplaceDialog = 'ReplaceDialog',
    /**
     * Break out of a loop
     */
    BreakLoop = 'BreakLoop',
    /**
     * End all of the current topics
     */
    CancelAllDialogs = 'CancelAllDialogs',
    /**
     * Command to cancel all of the current dialogs by emitting an event which must be caught to prevent cancelation from propagating
     */
    CancelDialog = 'CancelDialog',
    /**
     * Clears the state of all the variables.
     */
    ClearAllVariables = 'ClearAllVariables',
    /**
     * Continue the loop
     */
    ContinueLoop = 'ContinueLoop',
    /**
     * Break the debug
     */
    DebugBreak = 'DebugBreak',
    /**
     * Send an activity back to the user
     */
    DeleteActivity = 'DeleteActivity',
    /**
     * Deletes a property from memory
     */
    DeleteProperties = 'DeleteProperties',
    /**
     * Deletes a property from memory
     */
    DeleteProperty = 'DeleteProperty',
    /**
     * Lets you modify an array in memory
     */
    EditArray = 'EditArray',
    /**
     * Action which emits an event declaratively
     */
    EmitEvent = 'EmitEvent',
    /**
     * End the current topic
     */
    EndDialog = 'EndDialog',
    /**
     * This command ends the current turn without ending the dialog
     */
    EndTurn = 'EndTurn',
    /**
     * Calls BotFrameworkAdapter.GetActivityMembers() and sets the result to a memory property
     */
    GetActivityMembers = 'GetActivityMembers',
    /**
     * Calls BotFrameworkAdapter.GetConversationMembers () and sets the result to a memory property
     */
    GetConversationMembers = 'GetConversationMembers',
    /**
     * Goto an action by Id
     */
    GotoAction = 'GotoAction',
    /**
     * Action for performing an HttpRequest
     */
    HttpRequest = 'HttpRequest',
    /**
     * Conditional branch
     */
    IfCondition = 'IfCondition',
    /**
     * Conditional branching similar to an if / elseif / elseif / else chain
     */
    Condition = 'Condition',
    /**
     * Single conditional branch for an if or elseif
     */
    ConditionItem = 'ConditionItem',
    /**
     * End the current conversation.
     */
    EndConversation = 'EndConversation',
    /**
     * Send a message back to the user
     */
    SendMessage = 'SendMessage',
    /**
     * Send an activity back to the user
     */
    SendActivity = 'SendActivity',
    ExpressionHandoffContext = 'ExpressionHandoffContext',
    AutomaticHandoffContext = 'AutomaticHandoffContext',
    /**
     * Send an handoff activity
     */
    SendHandoffActivity = 'SendHandoffActivity',
    /**
     * Sets a property with the result of evaluating a value expression
     */
    SetProperties = 'SetProperties',
    /**
     * Sets a property with the result of evaluating a value expression
     */
    SetProperty = 'SetProperty',
    /**
     * Send an activity back to the user
     */
    SignOutUser = 'SignOutUser',
    /**
     * Conditional branch with multiple cases
     */
    SwitchCondition = 'SwitchCondition',
    /**
     * Track a custom event using IBotTelemetryClient
     */
    TelemetryTrackEventAction = 'TelemetryTrackEventAction',
    /**
     * Send an Tace activity back to the transcript
     */
    TraceActivity = 'TraceActivity',
    /**
     * Update an activity with replacement
     */
    UpdateActivity = 'UpdateActivity',
    /**
     * Container for the list of actions that are out of normal execution flow. It's still possible that question initializer references an action here and the action can be executed. Bot publish should give validation errors if the bot has at least one disconnected node container.
     */
    DisconnectedNodeContainer = 'DisconnectedNodeContainer',
    CardActionDefinition = 'CardActionDefinition',
    PropertyAssignment = 'PropertyAssignment',
    /**
     * Binds value expressions to the action inputs
     */
    ActionInputBinding = 'ActionInputBinding',
    /**
     * Binds action outputs to the properties
     */
    ActionOutputBinding = 'ActionOutputBinding',
    ContentShareContext = 'ContentShareContext',
    ManagedProperties = 'ManagedProperties',
    EmbeddedEntity = 'EmbeddedEntity',
    PrebuiltEntityReference = 'PrebuiltEntity',
    RegexEntityReference = 'RegexEntityReference',
    ClosedListEntityReference = 'ClosedListEntityReference',
    RegexEntity = 'RegexEntity',
    ClosedListEntity = 'ClosedListEntity',
    /**
     * Formerly known as NamedEntity.
     */
    ClosedListItem = 'ClosedListItem',
    TextSegment = 'TextSegment',
    ExpressionSegment = 'ExpressionSegment',
    TemplateLine = 'TemplateLine',
    /**
     * Represents a reference/pointer to a language generation template.
     */
    TemplateReference = 'TemplateReference',
    LanguageGenerationTemplate = 'LanguageGenerationTemplate',
    NormalTemplateBody = 'NormalTemplateBody',
    TemplateSwitchCase = 'TemplateSwitchCase',
    TemplateIfCondition = 'TemplateIfCondition',
    IfElseTemplateBody = 'IfElseTemplateBody',
    SwitchTemplateBody = 'SwitchTemplateBody',
    StructuredTemplateInvocation = 'StructuredTemplateInvocation',
    StructuredPropertyWithLine = 'StructuredPropertyWithLine',
    StructuredPropertyWithList = 'StructuredPropertyWithList',
    StructuredTemplateBody = 'StructuredTemplateBody',
    ActivityTemplate = 'Activity',
    MessageActivityTemplate = 'Message',
    VideoCardTemplate = 'VideoCardTemplate',
    ImageCardTemplate = 'ImageCardTemplate',
    AdaptiveCardTemplate = 'AdaptiveCardTemplate',
    HeroCardTemplate = 'HeroCardTemplate',
    /**
     * All Conditions in this group are joined together by an AND expression
     */
    AndConditionGroup = 'AndConditionGroup',
    /**
     * All Conditions in this group are joined together by an OR expression
     */
    OrConditionGroup = 'OrConditionGroup',
    /**
     * Represents a single binary or unary comparison.
     */
    BooleanCondition = 'BooleanCondition',
    /**
     * An expression that evaluates to T. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    EnumExpression_T = 'EnumExpression_T',
    /**
     * An expression that evaluates to T. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    ArrayExpression_T = 'ArrayExpression_T',
    /**
     * An expression that evaluates to T. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    ObjectExpression_T = 'ObjectExpression_T',
    /**
     * An expression that evaluates to DataValue. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    ValueExpression = 'ValueExpression',
    /**
     * An expression that evaluates to bool. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    BoolExpression = 'BoolExpression',
    /**
     * An expression that evaluates to double. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    NumberExpression = 'NumberExpression',
    /**
     * An expression that evaluates to long. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    IntExpression = 'IntExpression',
    /**
     * An expression that evaluates to string. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    StringExpression = 'StringExpression',
    /**
     * An expression that evaluates to DialogSchemaName. To get a value, use <see cref="IExpressionEngine.GetValue"
     */
    DialogExpression = 'DialogExpression',
}

/**
 * Kinds of BotElementDiagnostics
 */
 export enum BotElementDiagnosticKind
 {
     /**
      * Occurs when an expression does not return its assigned type.
      */
     IncorrectTypeError = 'IncorrectTypeError',
     /**
      * Static analysis error from an expression
      */
     ExpressionError = 'ExpressionError',
     /**
      * Error when the property/ariable has an invalid type. (e.g. we don't authorize Any type for the variable)
      */
     InvalidVariableType = 'InvalidVariableType',
     /**
      * Represents an error related to a property on the node. Property can be of any type.
      */
     PropertyError = 'PropertyError',
     /**
      * Represents an error related to an item in the list property. Compared to PropertyError class, it allows specifying the index.
      */
     ListPropertyItemError = 'ListPropertyItemError',
     /**
      * Represents an error related to an item in the dictionary property. Compared to PropertyError class, it allows specifying the key.
      */
     DictionaryPropertyItemError = 'DictionaryPropertyItemError',
     /**
      * Error when node references another resource or node but it wasn't found. (e.g. flow, skill, dialog not found)
      */
     InvalidReferenceError = 'InvalidReferenceError',
     /**
      * Error when we read output or write to input of the action but it was not found.
      */
     BindingKeyNotFoundError = 'BindingKeyNotFoundError',
     /**
      * Error when we assign an incorrect type to the input
      */
     BindingIncorrectTypeError = 'BindingIncorrectTypeError',
     /**
      * Error when node mutates the system variable
      */
     ReadOnlyVariableMutationError = 'ReadOnlyVariableMutationError',
     /**
      * Error when node is unknown to the system
      */
     UnknownElementError = 'UnknownElementError',
     /**
      * Provide diagnostic details on the variables that are in scope for a given dialog or node.
      */
     VariableInformationDiagnostic = 'VariableInformation',
 }