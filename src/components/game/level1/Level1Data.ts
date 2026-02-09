
export interface Email {
    id: number;
    sysId: string; // "MSG-XXXX" for realism
    sender: string;
    subject: string;
    content: string;
    hasAttachment?: boolean;
    attachmentName?: string;
    hasLink?: boolean;
    linkUrl?: string;
    isMalware?: boolean; // The critical flag for the target
    isPhishing?: boolean; // Flag for distraction/red herring (optional logic)
    timestamp: string;
    read: boolean;
}

// Static set of 7 emails for the classification task
const classificationEmails: Email[] = [
    {
        id: 1,
        sysId: "MSG-1001",
        sender: "HR Department <hr-update@company-internal.com>",
        subject: "Q4 Policy Updates",
        content: "Please review the updated holiday policy for Q4 attached below.\n\nRegards,\nHR Team",
        hasAttachment: true,
        attachmentName: "Policy_Q4.pdf",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        read: false,
        isMalware: false // Legitimate
    },
    {
        id: 2,
        sysId: "MSG-1002",
        sender: "IT Support <support@micros0ft-security.net>",
        subject: "URGENT: Password Expiry",
        content: "Your account password will expire in 2 hours. Click here to reset immediately to avoid lockout.",
        hasLink: true,
        linkUrl: "http://micros0ft-security.net/reset",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        read: false,
        isMalware: true // Phishing
    },
    {
        id: 3,
        sysId: "MSG-1003",
        sender: "Sarah Jenkins <sarah.jenkins@partner-corp.net>",
        subject: "Meeting Notes - Project Alpha",
        content: "Hi Team,\n\nGreat syncing up earlier. Here are the notes from our discussion.",
        hasAttachment: true,
        attachmentName: "Meeting_Notes.docx",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        read: true,
        isMalware: false // Legitimate
    },
    {
        id: 4,
        sysId: "MSG-1004",
        sender: "CEO <ceo.urgent@gmail.com>",
        subject: "Wire Transfer Needed ASAP",
        content: "I am in a meeting and can't talk. Please process this wire transfer immediately for a new vendor. It is critical.",
        hasLink: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        isMalware: true // Phishing (CEO Fraud)
    },
    {
        id: 5,
        sysId: "MSG-1005",
        sender: "Payroll <payroll@company-internal.com>",
        subject: "Your Payslip",
        content: "Your payslip for this month is available on the portal.",
        hasLink: true,
        linkUrl: "http://portal.company-internal.com/payslip",
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        read: true,
        isMalware: false // Legitimate
    },
    {
        id: 6,
        sysId: "MSG-1006",
        sender: "Amazon Svc <delivery@amazn-track.com>",
        subject: "Package Delivery Failed",
        content: "We could not deliver your package. unexpected fee required. Download form to reschedule.",
        hasAttachment: true,
        attachmentName: "Reschedule_Form.exe",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
        isMalware: true // Phishing
    },
    {
        id: 7,
        sysId: "MSG-1007",
        sender: "Admin <admin@goggle-docs-share.com>",
        subject: "Document Shared With You",
        content: "Admin has shared 'Salary_Bonus_List.xlsx' with you. Login to view.",
        hasLink: true,
        linkUrl: "http://goggle-login.com",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false,
        isMalware: true // Phishing
    }
];

export const getLevel1Emails = (): Email[] => {
    return [...classificationEmails];
};
