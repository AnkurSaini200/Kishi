import type { SecurityIssue as SecurityIssueType } from '../../types/security'
export function SecurityIssue({ issue }: { issue: SecurityIssueType }) { return <article><strong>{issue.title}</strong><p>{issue.description}</p></article> }
