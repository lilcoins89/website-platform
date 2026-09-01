/**
 * Optional programmable infrastructure layer.
 * Does NOT store analytics datasets. Platform works when Monad is disabled.
 */

export interface RuleDefinition {
  id: string;
  organizationId: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export interface WorkflowState {
  ruleId: string;
  lastEvaluatedAt?: string;
  lastTriggeredAt?: string;
  status: "idle" | "triggered" | "acknowledged";
}

let monadEnabled = false;

export function isMonadEnabled() {
  return monadEnabled;
}

export function setMonadEnabled(value: boolean) {
  monadEnabled = value;
}

export function evaluateRule(
  rule: RuleDefinition,
  context: { metric: string; value: number; threshold: number }
): boolean {
  if (!monadEnabled || !rule.enabled) return false;
  return context.value > context.threshold;
}

export function exampleCacAlertRule(organizationId: string): RuleDefinition {
  return {
    id: "rule_cac_20",
    organizationId,
    name: "Alert when CAC increases > 20%",
    condition: "cac_change_pct > 20",
    action: "notify",
    enabled: true,
  };
}
