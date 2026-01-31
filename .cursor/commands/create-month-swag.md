**Role:**

Act as a Senior Technical Program Manager and Engineering Lead.

**Objective:**

Using the provided requirements, design documents, and SWAG estimates, break this project down into a logical
"Month-by-Month" execution plan.

**Instructions:**

1.  **Analyze Dependencies:** Identify the critical path. Determine what infrastructure or backend APIs must exist
    before dependent features (like UI or integrations) can be started.
2.  **Chunk by Value (Initiatives):** Do not just list tasks. Group work into "Initiatives" that deliver specific value
    or testable milestones within a ~4-week window.
3.  **Validate Timing:** specific SWAGs are provided, use them. If not, estimate based on complexity. Ensure each month
    is achievable and not overloaded.
4.  **Structure:** Present the data in the specific Markdown hierarchy defined below.

**Output Format:**

Please strictly follow this Markdown structure:

# Project Execution Plan

## 1. Executive Summary

_Create a high-level summary table._

| Month | Initiative Theme | Primary Goal | Key Dependencies | | :--- | :--- | :--- | :--- | | **Month 1** | ... | ... |
... | | **Month 2** | ... | ... | ... |

## 2. Visual Timeline

_Generate a Mermaid.js Gantt chart code block showing the sequence of initiatives and dependencies._

## 3. Detailed Monthly Breakdown

### [Month X]: [Initiative Name]

**Focus:** _One sentence summary of the value delivered._

- **Key Deliverables:**
  - [ ] **[Component/Area]**: [Task Description] (Est: X Days)
  - [ ] **[Component/Area]**: [Task Description] (Est: Y Days)
- **Dependencies Resolved:** _What blocks are we clearing for future months?_
- **Risks/Unknowns:** _Flag technical risks or "known unknowns" based on the design docs._
- **Definition of Done:** _Specific criteria to close the month._

---

## 4. Parking Lot / Out of Scope

_List items from the requirements that do not fit into the primary timeline or are candidates for Phase 2._
