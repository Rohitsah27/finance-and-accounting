# Veridex Finance System — Insurance Accounting Flow Guide

This document explains the end-to-end accounting, billing, bordereau reporting, and cash settlement flow across the complete insurance distribution value chain under all three industry billing models:

1. **DBA (Direct Bill to Agency / Agency Bill)**: $\text{Insured} \longrightarrow \text{Broker / Agency} \longrightarrow \text{MGA} \longrightarrow \text{Carrier}$
2. **DBM (Direct Bill to MGA)**: $\text{Insured} \longrightarrow \text{MGA} \longrightarrow \text{Carrier}$ *(with Producer Commission Remittances)*
3. **DBC (Direct Bill to Carrier)**: $\text{Insured} \longrightarrow \text{Carrier}$ *(with MGA & Broker Commission Disbursements)*

---

## 1. Stakeholders & Compensation Architecture

For a standard policy with **$10,000.00 Gross Written Premium**, **10% Broker Commission ($1,000.00)**, and **5% MGA Override Commission ($500.00)**:

1. **Insured (Policyholder)**: The policyholder responsible for paying the **$10,000.00** gross premium.
2. **Broker / Retail Producer (Agency)**: Sells the policy to the Insured and earns **$1,000.00 (10%)** retail commission.
3. **MGA (Managing General Agent)**: Program manager with delegated underwriting authority earning **$500.00 (5%)** override commission.
4. **Carrier (Risk-Bearing Insurer)**: Underwriting company carrying policy risk, booking **$10,000.00** unearned premium reserve, recognizing **$1,500.00** total commission acquisition expense, and settling **$8,500.00** net cash.

---

## 2. The 3 Billing & Settlement Situations

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL 1: DBA (Direct Bill to Agency / Agency Bill)                                               │
│ Insured pays Broker ($10k) ➔ Broker remits Net to MGA ($9k) ➔ MGA remits Net-Net to Carrier ($8.5k)│
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL 2: DBM (Direct Bill to MGA)                                                                │
│ Insured pays MGA ($10k) ➔ MGA pays Broker Comm ($1k) ➔ MGA remits Net-Net to Carrier ($8.5k)    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MODEL 3: DBC (Direct Bill to Carrier)                                                            │
│ Insured pays Carrier ($10k) ➔ Carrier disburses MGA/Broker Comm ($1.5k) ➔ MGA passes Broker ($1k)│
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Situation 1: DBA (Direct Bill to Agency / Agency Bill)

### Flow Overview:
$$\text{Insured} \xrightarrow{\$10,000} \text{Broker} \xrightarrow{\$9,000} \text{MGA} \xrightarrow{\$8,500} \text{Carrier}$$

### Detailed Accounting Steps & Journal Entries:

#### Step 1.1: Broker Invoices Insured
* **Broker Journal Entry**:
  * **Dr. 1100** Premium Receivable — Insured: **$10,000.00**
  * **Cr. 2200** Premium Payable — MGA: **$9,000.00**
  * **Cr. 6100** Commission Revenue (Broker 10%): **$1,000.00**

#### Step 1.2: Insured Pays Gross Premium to Broker
* **Broker Journal Entry**:
  * **Dr. 1001** Cash / Bank (Broker Premium Trust): **$10,000.00**
  * **Cr. 1100** Premium Receivable — Insured: **$10,000.00**

#### Step 1.3: Broker Remits Net Premium to MGA ($9,000)
* **Broker Journal Entry**:
  * **Dr. 2200** Premium Payable — MGA: **$9,000.00**
  * **Cr. 1001** Cash / Bank (Broker Premium Trust): **$9,000.00**
* *Broker Position Closed: Cash +$1,000.00 | Net Revenue +$1,000.00*

#### Step 1.4: MGA Receives Net Premium from Broker ($9,000)
* **MGA Journal Entry**:
  * **Dr. 1001** Cash / Bank (MGA Premium Trust): **$9,000.00**
  * **Cr. 2200** Premium Payable — Carrier: **$8,500.00**
  * **Cr. 6100** Commission Revenue (MGA Override 5%): **$500.00**

#### Step 1.5: MGA Remits Net-Net Premium to Carrier ($8,500)
* **MGA Journal Entry**:
  * **Dr. 2200** Premium Payable — Carrier: **$8,500.00**
  * **Cr. 1001** Cash / Bank (MGA Premium Trust): **$8,500.00**
* *MGA Position Closed: Cash +$500.00 | Net Revenue +$500.00*

#### Step 1.6: Carrier Ingests Bordereau (BX Report)
* **Carrier Journal Entry**:
  * **Dr. 1100** Premium Receivable — MGA: **$8,500.00**
  * **Dr. 6100** Commission Expense — Broker: **$1,000.00**
  * **Dr. 6101** Commission Expense — MGA Override: **$500.00**
  * **Cr. 2100** Unearned Premium Reserve: **$10,000.00**

#### Step 1.7: Carrier Reconciles Net Cash Settlement from MGA ($8,500)
* **Carrier Journal Entry**:
  * **Dr. 1001** Cash / Bank (Carrier Operating): **$8,500.00**
  * **Cr. 1100** Premium Receivable — MGA: **$8,500.00**
* *Carrier Position: Cash +$8,500.00 | Unearned Reserve $10,000.00 | Net Acq. Cost $1,500.00*

---

## 4. Situation 2: DBM (Direct Bill to MGA)

### Flow Overview:
$$\text{Insured} \xrightarrow{\$10,000} \text{MGA} \begin{cases} \xrightarrow{\$1,000} \text{Broker (Commission Remittance)} \\ \xrightarrow{\$8,500} \text{Carrier (Net Settlement)} \end{cases}$$

### Detailed Accounting Steps & Journal Entries:

#### Step 2.1: MGA Invoices Insured Directly
* **MGA Journal Entry**:
  * **Dr. 1100** Premium Receivable — Insured: **$10,000.00**
  * **Cr. 2200** Premium Payable — Carrier: **$8,500.00**
  * **Cr. 2100** Commission Payable — Broker: **$1,000.00**
  * **Cr. 6100** Commission Revenue — MGA Override: **$500.00**

#### Step 2.2: Insured Pays Gross Premium Directly to MGA
* **MGA Journal Entry**:
  * **Dr. 1001** Cash / Bank (MGA Premium Trust): **$10,000.00**
  * **Cr. 1100** Premium Receivable — Insured: **$10,000.00**

#### Step 2.3: MGA Pays Broker Commission Remittance ($1,000)
* **MGA Journal Entry**:
  * **Dr. 2100** Commission Payable — Broker: **$1,000.00**
  * **Cr. 1001** Cash / Bank (MGA Premium Trust): **$1,000.00**
* **Broker Journal Entry (Receipt)**:
  * **Dr. 1001** Cash / Bank (Broker Operating): **$1,000.00**
  * **Cr. 6100** Commission Revenue: **$1,000.00**

#### Step 2.4: MGA Remits Net Settlement to Carrier ($8,500)
* **MGA Journal Entry**:
  * **Dr. 2200** Premium Payable — Carrier: **$8,500.00**
  * **Cr. 1001** Cash / Bank (MGA Premium Trust): **$8,500.00**
* *MGA Position Closed: Cash +$500.00 | Net Revenue +$500.00*

#### Step 2.5: Carrier Ingests Bordereau & Reconciles Cash
* **Carrier Journal Entry (Bordereau Ingestion)**:
  * **Dr. 1100** Premium Receivable — MGA: **$8,500.00**
  * **Dr. 6100** Commission Expense — Broker: **$1,000.00**
  * **Dr. 6101** Commission Expense — MGA Override: **$500.00**
  * **Cr. 2100** Unearned Premium Reserve: **$10,000.00**
* **Carrier Journal Entry (Cash Settlement)**:
  * **Dr. 1001** Cash / Bank (Carrier Operating): **$8,500.00**
  * **Cr. 1100** Premium Receivable — MGA: **$8,500.00**

---

## 5. Situation 3: DBC (Direct Bill to Carrier)

### Flow Overview:
$$\text{Insured} \xrightarrow{\$10,000} \text{Carrier} \xrightarrow{\$1,500 \text{ Comm}} \text{MGA} \xrightarrow{\$1,000 \text{ Comm}} \text{Broker}$$

### Detailed Accounting Steps & Journal Entries:

#### Step 3.1: Carrier Invoices Insured Directly
* **Carrier Journal Entry**:
  * **Dr. 1100** Premium Receivable — Insured: **$10,000.00**
  * **Cr. 2100** Unearned Premium Reserve: **$10,000.00**

#### Step 3.2: Insured Pays Gross Premium Directly to Carrier
* **Carrier Journal Entry**:
  * **Dr. 1001** Cash / Bank (Carrier Operating): **$10,000.00**
  * **Cr. 1100** Premium Receivable — Insured: **$10,000.00**

#### Step 3.3: Carrier Accrues & Disburses Commission Remittance ($1,500)
* **Carrier Journal Entry (Commission Accrual)**:
  * **Dr. 6100** Commission Expense — Broker: **$1,000.00**
  * **Dr. 6101** Commission Expense — MGA Override: **$500.00**
  * **Cr. 2100** Commission Payable — Intermediaries: **$1,500.00**
* **Carrier Journal Entry (Commission Disbursement to MGA)**:
  * **Dr. 2100** Commission Payable — Intermediaries: **$1,500.00**
  * **Cr. 1001** Cash / Bank (Carrier Operating): **$1,500.00**
* *Carrier Net Cash: $10,000 - $1,500 = $8,500.00*

#### Step 3.4: MGA Receives Combined Commission & Disburses Broker Share
* **MGA Journal Entry (Receipt from Carrier)**:
  * **Dr. 1001** Cash / Bank (MGA Operating): **$1,500.00**
  * **Cr. 6100** Commission Revenue (MGA Override 5%): **$500.00**
  * **Cr. 2100** Commission Payable — Broker: **$1,000.00**
* **MGA Journal Entry (Disbursement to Broker)**:
  * **Dr. 2100** Commission Payable — Broker: **$1,000.00**
  * **Cr. 1001** Cash / Bank (MGA Operating): **$1,000.00**
* *MGA Position Closed: Cash +$500.00 | Net Revenue +$500.00*

#### Step 3.5: Broker Receives Commission Remittance
* **Broker Journal Entry**:
  * **Dr. 1001** Cash / Bank (Broker Operating): **$1,000.00**
  * **Cr. 6100** Commission Revenue (Broker 10%): **$1,000.00**
* *Broker Position Closed: Cash +$1,000.00 | Net Revenue +$1,000.00*

---

## 6. Comprehensive Value Chain Comparison Matrix

| Financial Metric | DBA (Agency Bill) | DBM (Direct Bill to MGA) | DBC (Direct Bill to Carrier) |
| :--- | :--- | :--- | :--- |
| **Invoiced By** | Broker / Retail Agency | Managing General Agent (MGA) | Risk Carrier |
| **Gross Invoiced Amount** | $10,000.00 | $10,000.00 | $10,000.00 |
| **Insured Cash Paid To** | Broker ($10,000.00) | MGA ($10,000.00) | Carrier ($10,000.00) |
| **Broker Cash In / Out** | +$10,000 / -$9,000 | +$1,000 (MGA payout) / $0 | +$1,000 (MGA payout) / $0 |
| **Broker Net Margin** | **+$1,000.00 (10%)** | **+$1,000.00 (10%)** | **+$1,000.00 (10%)** |
| **MGA Cash In / Out** | +$9,000 / -$8,500 | +$10,000 / -$9,500 ($1k+$8.5k) | +$1,500 / -$1,000 |
| **MGA Net Margin** | **+$500.00 (5%)** | **+$500.00 (5%)** | **+$500.00 (5%)** |
| **Carrier Cash In / Out** | +$8,500 (Net settlement) / $0 | +$8,500 (Net settlement) / $0 | +$10,000 / -$1,500 (Comm wire) |
| **Carrier Net Cash** | **+$8,500.00** | **+$8,500.00** | **+$8,500.00** |
| **Carrier Reserve** | $10,000.00 Unearned | $10,000.00 Unearned | $10,000.00 Unearned |
| **Carrier Monthly Earn** | $833.33 / month | $833.33 / month | $833.33 / month |

---

## 7. Automated Test Suite

To verify all 3 billing models programmatically, run:
```bash
node test-accounting-flows.js
```
The test suite validates:
1. Double-entry balancing (`Debit === Credit`) across all JEs.
2. Intermediary clearing account reconciliations (Accounts 1100, 2200, 2100).
3. Exact matching of ending cash and revenue balances across Broker, MGA, and Carrier ledgers.
