export type ActionStatus = 'pending'|'fulfilled'|'rejected';

export const actionHelper = (actionType: string, status: ActionStatus) => `${actionType}/${status}`;
export const apiActionHelper = (actionType: string):[pending:string, fulfilled:string, rejected: string] =>
    [
        actionHelper(actionType, 'pending'),
        actionHelper(actionType, 'fulfilled'),
        actionHelper(actionType, 'rejected')
    ];
