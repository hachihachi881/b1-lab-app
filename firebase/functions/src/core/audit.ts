export type AuditLogInput = {
    actorUid: string;
    action: string;
    resource: string;
    resourceId?: string;
};

export const writeAuditLog = async (_input: AuditLogInput): Promise<void> => {
    throw new Error("Not implemented");
};
