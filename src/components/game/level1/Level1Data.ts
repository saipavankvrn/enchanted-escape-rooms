
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

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const departments = ["HR", "IT", "Finance", "Sales", "Marketing", "Engineering", "Legal", "Operations"];
const domains = ["company-internal.com", "partner-corp.net", "service-provider.io", "client-firm.org"];

const subjects = [
    "Meeting Requst", "Project Update", "Invoice #{{NUM}}", "Q3 Report", "Team Lunch", "Policy Update",
    "System Maintenance", "Password Reset", "New Hire", "Feedback Needed", "Weekly Sync", "Budget Approval",
    "Client Call Notes", "Design Assets", "Bug Report", "Feature Request", "Holiday Schedule", "Expense Report"
];

const contents = [
    "Hi Team,\n\nPlease review the attached document and let me know your thoughts.\n\nBest,\n{{NAME}}",
    "Attached is the latest version of the project plan. We need sign-off by EOD.",
    "Can we reschedule our 2 PM meeting? Something urgent came up.",
    "Just a reminder to submit your timesheets for this week.",
    "Has anyone seen the updated specs for the new feature? Need them ASAP.",
    "Great work on the presentation yesterday! everyone was impressed.",
    "The server will be down for maintenance tonight from 10 PM to 2 AM.",
    "Please find the invoice attached for last month's services.",
    "Welcome to the team! We're excited to have you on board.",
    "Don't forget the town hall meeting happening in 30 minutes."
];

const attachments = [
    "Project_Plan_v2.pdf", "Meeting_Notes.docx", "Budget_2024.xlsx", "Design_Mockups.zip",
    "Invoice_INV{{NUM}}.pdf", "Presentation_Deck.pptx", "Script_Draft.txt", "Logs_Error.log",
    "Employee_Handbook.pdf", "Contract_Draft_Final.docx", "Screenshot_Error.png"
];

const links = [
    "http://jira.internal/browse/PROJ-{{NUM}}",
    "https://docs.google.com/document/d/{{ID}}",
    "http://confluence.internal/pages/viewpage.action?pageId={{ID}}",
    "https://zoom.us/j/{{ID}}",
    "http://github.internal/repo/pull/{{NUM}}"
];

const generateRandomEmail = (id: number): Email => {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fn} ${ln}`;
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    // 20% chance of being external
    const isExternal = Math.random() < 0.2;
    const emailAddr = isExternal
        ? `${fn.toLowerCase()}.${ln.toLowerCase()}@gmail.com`
        : `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`;

    const rawSubj = subjects[Math.floor(Math.random() * subjects.length)];
    const rawContent = contents[Math.floor(Math.random() * contents.length)];
    const num = Math.floor(Math.random() * 9000) + 1000;

    const subject = rawSubj.replace("{{NUM}}", num.toString());
    const content = rawContent.replace("{{NAME}}", fn).replace("{{NUM}}", num.toString());

    // 30% chance of attachment
    const hasAttr = Math.random() < 0.3;
    let attrName = undefined;
    if (hasAttr) {
        attrName = attachments[Math.floor(Math.random() * attachments.length)].replace("{{NUM}}", num.toString());
    }

    // 20% chance of link if no attachment
    const hasLink = !hasAttr && Math.random() < 0.2;
    let linkUrl = undefined;
    if (hasLink) {
        linkUrl = links[Math.floor(Math.random() * links.length)]
            .replace("{{NUM}}", num.toString())
            .replace("{{ID}}", Math.random().toString(36).substring(7));
    }

    const date = new Date();
    date.setMinutes(date.getMinutes() - (id * (Math.random() * 60))); // staggering times

    return {
        id,
        sysId: `MSG-${10000 + id}`,
        sender: `${name} <${emailAddr}>`,
        subject: subject,
        content: content,
        hasAttachment: hasAttr,
        attachmentName: attrName,
        hasLink: hasLink,
        linkUrl: linkUrl,
        timestamp: date.toISOString(),
        read: Math.random() > 0.5,
        isMalware: false // Default safe
    };
};

export const getLevel1Emails = (): Email[] => {
    const emails: Email[] = [];
    // Generate 59 random emails
    for (let i = 0; i < 59; i++) {
        emails.push(generateRandomEmail(i + 1));
    }

    // The ONE Malicious Email
    const targetEmail: Email = {
        id: 999,
        sysId: "MSG-66666",
        sender: "Security Audit <audit@security-check-external.net>",
        subject: "URGENT: Vulnerability Assessment Report - Action Required",
        content: "Attached is the critical vulnerability assessment for Q4. Please review immediately.\n\nNOTE: This file is password protected for security. Use 'admin123' to decrypt.\n\nRegards,\nExternal Audit Team",
        hasAttachment: true,
        attachmentName: "Q4_Vuln_Report.pdf.exe", // The malicious payload
        hasLink: false,
        timestamp: new Date().toISOString(), // Very recent
        read: false,
        isMalware: true
    };

    // Insert at fixed position (38th email / index 37) as requested
    const insertPos = 37;
    emails.splice(insertPos, 0, targetEmail);

    // Sort by date (mock sort by keeping index roughly in order or re-sorting)
    // Actually our generator made them older as ID increased, so insertion at top preserves newness mostly.

    return emails;
};
