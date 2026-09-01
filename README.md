# Veridex Finance System — Insurance Accounting Flow Guide

This document explains the end-to-end accounting, billing, bordereau reporting, and cash settlement flow across the complete 4-tier insurance distribution value chain:

$$\text{Insured (Policyholder)} \longrightarrow \text{Broker (Retail Producer)} \longrightarrow \text{MGA (Managing General Agent)} \longrightarrow \text{Carrier (Risk-Bearing Insurer)}$$

It outlines the interactions between all four stakeholders and details the exact General Ledger (GL) journal entries (JE hits) recorded at each step.

---

## 1. Stakeholders

1. **Insured**: The customer buying the insurance policy who is responsible for paying the gross written premium ($10,000).
2. **Broker / Retail Agent**: The licensed retail producer who sells the policy directly to the Insured, invoices the Insured $10,000, collects the cash, retains a 10% Retail Commission ($1,000), and remits $9,000 Net Premium to the MGA.
3. **MGA (Managing General Agent)**: The program manager with delegated underwriting authority. The MGA receives $9,000 from the Broker, retains a 5% MGA Commission ($500), remits $8,500 Net-Net Premium to the Carrier, and produces the monthly Bordereau (BX report).
4. **Carrier**: The risk-bearing insurance underwriting company carrying the policy risk on its balance sheet. The Carrier ingests the Bordereau, books the $10,000 Unearned Premium Liability, recognizes $1,500 total commission expense ($1,000 Broker + $500 MGA), and reconciles the $8,500 net settlement cash.

---

## 2. End-to-End Accounting Flow Diagram

The diagram below visualizes the sequencing of invoicing, payments, bordereau reporting, and cash settlements across the 4-tier chain:

```text
Start: Policy Bind
        ↓
[Action] Broker Invoices Insured
Amount: $10,000 Gross Premium
   ↳ Broker Journal Entry:
      Dr. Premium Receivable (1100)          $10,000
      Cr. Premium Payable - MGA (2200)        $9,000
      Cr. Commission Revenue (6100)           $1,000
        ↓
[Action] Insured Pays Broker
Amount: $10,000 Cash
   ↳ Broker Journal Entry:
      Dr. Cash / Bank (1001)                 $10,000
      Cr. Premium Receivable (1100)          $10,000
        ↓
[Action] Broker Pays Net Premium to MGA
Amount: $9,000 Cash Remittance ($10,000 Gross less $1,000 Broker Comm)
   ↳ Broker Journal Entry:
      Dr. Premium Payable - MGA (2200)        $9,000
      Cr. Cash / Bank (1001)                  $9,000
   ↳ MGA Journal Entry:
      Dr. Cash / Bank (1001)                  $9,000
      Cr. Premium Payable - Carrier (2200)    $8,500
      Cr. Commission Revenue (6100)             $500
        ↓
[Action] MGA Pays Net Premium to Carrier
Amount: $8,500 Cash Remittance ($9,000 Received less $500 MGA Comm)
   ↳ MGA Journal Entry:
      Dr. Premium Payable - Carrier (2200)    $8,500
      Cr. Cash / Bank (1001)                  $8,500
        ↓
[Action] MGA Sends Monthly Bordereau (BX Report) to Carrier
Summary: Gross $10,000 | Broker Comm $1,000 | MGA Comm $500 | Net Premium $8,500
        ↓
[Action] Carrier Receives and Records Bordereau
   ↳ Carrier Journal Entry:
      Dr. Premium Receivable - MGA (1100)     $8,500
      Dr. Commission Expense - Broker (6100)  $1,000
      Dr. Commission Expense - MGA (6101)       $500
      Cr. Unearned Premium (2100)            $10,000
        ↓
[Action] Carrier Receives and Matches Net Premium Settlement
Amount: $8,500 Cash matched to outstanding MGA Receivable
   ↳ Carrier Journal Entry:
      Dr. Cash / Bank (1001)                  $8,500
      Cr. Premium Receivable - MGA (1100)     $8,500
        ↓
Process Complete
```

---

## 3. Detailed Step-by-Step Flow & Journal Entries

This example assumes a policy is issued with a **Gross Written Premium of $10,000**, a **10% Broker Commission ($1,000)**, and a **5% MGA Commission ($500)**, resulting in a **Net-Net Premium of $8,500** due to the Carrier.

### Step 1: Broker Issues Invoice to the Insured
* **Action**: The policy is bound in the system; the Broker generates a gross invoice for the Insured.
* **Broker's Perspective**: The Broker recognizes a receivable from the Insured, a payable to the MGA, and broker commission revenue.
* **Journal Entry (Broker Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **1100** | Premium Receivable — Insured | 10,000 | | Customer (Insured) / State / LOB |
  | **2200** | Premium Payable — MGA | | 9,000 | MGA Partner / Program |
  | **6100** | Commission Revenue (Broker) | | 1,000 | LOB / Cost Center |

### Step 2: Insured Pays Gross Premium to Broker
* **Action**: The Insured pays **$10,000** via bank transfer or check into the Broker's Premium Trust bank account.
* **Broker's Perspective**: The Broker records cash in trust and clears the Insured's receivable.
* **Journal Entry (Broker Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **1001** | Cash / Bank (Broker Premium Trust) | 10,000 | | Cost Center |
  | **1100** | Premium Receivable — Insured | | 10,000 | Customer (Insured) / State / LOB |

### Step 3: Broker Remits Net Premium to MGA
* **Action**: The Broker initiates a bank transfer of **$9,000** ($10,000 gross less $1,000 retained commission) to the MGA.
* **Broker's Perspective**: The Broker reduces trust cash and extinguishes their liability to the MGA.
* **Journal Entry (Broker Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **2200** | Premium Payable — MGA | 9,000 | | MGA Partner / Program |
  | **1001** | Cash / Bank (Broker Premium Trust) | | 9,000 | Cost Center |

### Step 4: MGA Receives Net Premium from Broker
* **Action**: The MGA receives **$9,000** in their Premium Trust account from the Broker.
* **MGA's Perspective**: The MGA records the incoming cash, books their liability to the Carrier ($8,500), and recognizes MGA commission revenue ($500).
* **Journal Entry (MGA Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **1001** | Cash / Bank (MGA Premium Trust) | 9,000 | | Cost Center |
  | **2200** | Premium Payable — Carrier | | 8,500 | Carrier Partner |
  | **6100** | Commission Revenue (MGA) | | 500 | LOB / Program / Cost Center |

### Step 5: MGA Pays Net-Net Premium to the Carrier
* **Action**: The MGA initiates a cash remittance of **$8,500** ($9,000 received less $500 MGA commission) to the Carrier.
* **MGA's Perspective**: The MGA reduces their trust cash balance and settles their liability to the Carrier.
* **Journal Entry (MGA Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **2200** | Premium Payable — Carrier | 8,500 | | Carrier Partner |
  | **1001** | Cash / Bank (MGA Premium Trust) | | 8,500 | Cost Center |

### Step 6: MGA Sends Monthly Bordereau (BX Report) to the Carrier
* **Action**: The MGA submits the monthly Bordereau transaction log. The Carrier uploads this file into their Veridex subledger engine.
* **Summary Log**:
  ```text
  Policy No.     : POL-2026-08819
  Insured        : Commercial Logistics Corp
  Retail Broker  : Links Insurance Agency (BROK-01)
  MGA Partner    : Futuristic Underwriters (MGA-01)
  Risk Carrier   : Southlake Insurance Co. (CAR-01)
  Gross Premium  : $10,000.00
  Broker Comm    : ($ 1,000.00)  [10.0%]
  MGA Comm       : ($   500.00)  [ 5.0%]
  Net Remittance : $ 8,500.00
  ```
* **Carrier's Perspective**: Upon ingestion, the Carrier books the full gross risk (unearned premium liability), records the broker and MGA commission acquisition costs, and establishes a net receivable due from the MGA.
* **Journal Entry (Carrier Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **1100** | Premium Receivable — MGA | 8,500 | | MGA Partner / State / LOB |
  | **6100** | Commission Expense — Broker | 1,000 | | Broker Partner / LOB |
  | **6101** | Commission Expense — MGA Override | 500 | | MGA Partner / Cost Center |
  | **2100** | Unearned Premium | | 10,000 | MGA Partner / State / LOB |

### Step 7: Carrier Receives Settlement Cash from MGA
* **Action**: The Carrier receives the **$8,500** bank wire sent by the MGA in Step 5. The Carrier reconciles this cash receipt against the outstanding Bordereau receivable.
* **Carrier's Perspective**: The Carrier increases their cash balance and clears the receivable due from the MGA.
* **Journal Entry (Carrier Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **1001** | Cash / Bank (Carrier Operating/Trust) | 8,500 | | Cost Center |
  | **1100** | Premium Receivable — MGA | | 8,500 | MGA Partner / State / LOB |

### Step 8: Subsequent Monthly Premium Earning (Carrier Revenue Recognition)
* **Action**: For a 12-month annual policy, Carrier amortizes the unearned premium reserve monthly ($10,000 / 12 = **$833.33 / month**).
* **Journal Entry (Carrier Ledger)**:
  | Account Code | Account Name | Debit ($) | Credit ($) | Dimension Scope |
  |---|---|---|---|---|
  | **2100** | Unearned Premium | 833.33 | | LOB / State / Treaty |
  | **4100** | Net Earned Premium Revenue | | 833.33 | LOB / State / Carrier |

---

## 4. Summary Matrix of Value Chain Accounting

| Tier | Cash In | Cash Out | Commission Earned | Net GL Position |
| :--- | :--- | :--- | :--- | :--- |
| **Insured** | — | $10,000 | — | Prepaid Insurance Expense: $10,000 |
| **Broker** | $10,000 (from Insured) | $9,000 (to MGA) | **$1,000 (10%)** | Net Revenue: $1,000 |
| **MGA** | $9,000 (from Broker) | $8,500 (to Carrier) | **$500 (5%)** | Net Revenue: $500 |
| **Carrier** | $8,500 (from MGA) | — | ($1,500 Total Expense) | Gross Risk: $10,000 Reserve / Net Earned Revenue: $8,500 |

---

## 5. How Veridex Automates & Reconciles This Flow

In the Veridex system, these steps are managed seamlessly by specialized modules:
1. **Multi-Entity Architecture**: Switch between Broker, MGA, and Carrier workspaces with continuous, interconnected ledger views.
2. **Subledger & Automated Split Engine**: Automatically ingests bulk MGA bordereau uploads (Excel/CSV) and executes multi-tier commission calculations, tax withholdings, and net-settlement schedules.
3. **Multi-Dimension Accounting (GL)**: Every Journal Entry posted attaches dimensions such as `broker`, `mga`, `state`, and `lob` (Line of Business). This ensures granular financial reports like Trial Balances and Balance Sheets can be filtered dynamically by partner or region.
4. **Reconciliation Module**: Veridex checks bank statements against subledgers automatically, alerting users to any variances between MGA-reported cash remittances and uploaded bordereaux.
