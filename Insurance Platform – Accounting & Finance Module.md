# Insurance Platform – Accounting & Finance Module

## Overview

This project is part of a modular insurance platform consisting of five core modules:

1. **Product Studio**
2. **Underwriting**
3. **Rater**
4. **Policy Administration System (PAS)**
5. **Accounting & Finance**

The purpose of this document is to define the architecture, responsibilities, integrations, and data flow for the **Accounting & Finance module**, especially its integration with the **Policy Administration System (PAS)**.

---

# 1. Platform Architecture

The overall insurance platform follows the business flow below:

```text
Product Studio
      │
      ▼
Underwriting
      │
      ▼
Rater
      │
      ▼
PAS (Policy Administration System)
      │
      │ Business & Financial Events
      ▼
Accounting & Finance
```

Each module has a separate responsibility.

```text
┌─────────────────────────────────────────────┐
│                PRODUCT STUDIO               │
│                                             │
│  • Products                                 │
│  • Coverages                                │
│  • Rules                                    │
│  • Fees                                     │
│  • Product Configuration                    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 UNDERWRITING                │
│                                             │
│  • Risk Assessment                          │
│  • Eligibility                              │
│  • Approval / Rejection                     │
│  • Underwriting Conditions                  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                    RATER                    │
│                                             │
│  • Premium Calculation                      │
│  • Fees                                     │
│  • Taxes                                    │
│  • Discounts                                │
│  • Commission Calculation                   │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                    PAS                      │
│        Policy Administration System         │
│                                             │
│  • Policy Lifecycle                         │
│  • Policy Transactions                      │
│  • Billing                                  │
│  • Invoices                                 │
│  • Payments                                 │
│  • Endorsements                             │
│  • Cancellations                            │
└──────────────────────┬──────────────────────┘
                       │
                       │ Business Events
                       │ Financial Events
                       ▼
┌─────────────────────────────────────────────┐
│           ACCOUNTING & FINANCE              │
│                                             │
│  • Accounting Rules                         │
│  • Journal Entries                          │
│  • Accounts Receivable                      │
│  • Accounts Payable                         │
│  • General Ledger                           │
│  • Cash Management                          │
│  • Reconciliation                           │
│  • Financial Reporting                      │
└─────────────────────────────────────────────┘
```

---

# 2. Module Responsibilities

## 2.1 Product Studio

Product Studio is responsible for configuring insurance products.

It manages:

- Insurance products
- Coverages
- Product rules
- Fees
- Product configurations
- Eligibility rules
- Product versions

Example:

```text
Product: Commercial Liability Insurance

Coverage:
- General Liability
- Property Damage

Base Premium:
₹50,000

Policy Fee:
₹2,000
```

Product Studio provides product configuration to downstream modules.

---

## 2.2 Underwriting

Underwriting determines whether a risk should be accepted.

Responsibilities include:

- Risk assessment
- Eligibility validation
- Approval
- Rejection
- Referral
- Underwriting conditions
- Risk classification

Example:

```text
Application Received
        │
        ▼
Risk Assessment
        │
        ▼
┌─────────────────────┐
│ Is Risk Acceptable? │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
   Yes          No
     │           │
     ▼           ▼
 Approved     Declined
```

Approved policies move forward for rating and policy processing.

---

## 2.3 Rater

The Rater is responsible for calculating financial values related to the insurance policy.

It calculates:

- Premium
- Fees
- Taxes
- Discounts
- Surcharges
- Commissions

Example:

```text
Base Premium        ₹100,000
Policy Fee            ₹2,000
Discount             -₹5,000
Tax                  ₹17,460
--------------------------------
Total Payable        ₹114,460
```

The Rater provides calculated values to PAS.

---

## 2.4 Policy Administration System (PAS)

PAS manages the complete policy lifecycle.

PAS is responsible for:

- Policy creation
- Policy issuance
- Policy renewal
- Endorsements
- Cancellations
- Reinstatements
- Billing
- Invoice management
- Payment tracking
- Policy transaction management

PAS acts as the operational source of truth for policy-related transactions.

---

## 2.5 Accounting & Finance

Accounting & Finance is responsible for converting business and financial events into accounting records.

It manages:

- Chart of Accounts
- Accounting rules
- Journal Entries
- Accounts Receivable
- Accounts Payable
- General Ledger
- Cash management
- Commission accounting
- Carrier settlements
- Reconciliation
- Financial reporting
- Period close

---

# 3. Core Architectural Principle

The boundary between PAS and Accounting & Finance must be clearly defined.

```text
PAS
│
│ "What happened?"
│
▼
Accounting & Finance
│
│ "What does this mean financially?"
│
▼
Accounting Records
```

Example:

```text
PAS:
Policy POL-001 was bound.

Premium: ₹100,000
Tax: ₹18,000
Broker Commission: ₹10,000
```

Accounting & Finance determines:

```text
What accounting accounts should be affected?

• Accounts Receivable
• Premium Revenue
• Tax Payable
• Commission Expense
• Commission Payable
```

PAS should not directly manage:

- General Ledger accounts
- Journal Entries
- Accounting rules
- Financial posting logic

These responsibilities belong to the Accounting & Finance module.

---

# 4. PAS to Accounting & Finance Integration

PAS sends business and financial events to Accounting & Finance.

The general flow is:

```text
Policy Transaction
       │
       ▼
PAS
       │
       │ Event
       ▼
Accounting Event Processor
       │
       ▼
Validation
       │
       ▼
Accounting Rules Engine
       │
       ▼
Journal Entry Generator
       │
       ├───────────────┐
       ▼               ▼
Accounts             General
Receivable/Payable   Ledger
       │               │
       └───────┬───────┘
               ▼
        Financial Reporting
```

---

# 5. Data Required from PAS

Accounting & Finance requires sufficient information to process financial transactions.

## 5.1 Policy Information

```text
Policy ID
Policy Number
Policy Version
Product ID
Policy Status
Effective Date
Expiration Date
Transaction Date
Transaction Type
```

---

## 5.2 Party Information

```text
Insured
Customer
Broker
MGA
Carrier
Agency
Producer
```

Each party should have a unique identifier.

Example:

```text
insured_id
broker_id
carrier_id
mga_id
```

---

## 5.3 Financial Information

```text
Premium
Fees
Taxes
Discounts
Surcharges
Commission
Refund Amount
Adjustment Amount
Currency
```

Example:

```text
Gross Premium:        ₹100,000
Tax:                   ₹18,000
Broker Commission:     ₹10,000
```

---

## 5.4 Billing Information

```text
Invoice ID
Invoice Number
Invoice Date
Due Date
Payment Terms
Invoice Amount
Outstanding Amount
Invoice Status
```

---

## 5.5 Payment Information

```text
Payment ID
Payment Date
Payment Amount
Payment Method
Payment Reference
Bank Account
Payment Status
Currency
```

---

## 5.6 Audit Information

Every event should contain:

```text
Event ID
Transaction ID
Source System
Correlation ID
Event Timestamp
Created By
Version
```

This is important for auditability and traceability.

---

# 6. Event-Driven Integration

PAS should send events to Accounting & Finance.

Example event:

```json
{
  "event_id": "EVT-001",
  "event_type": "POLICY_BOUND",
  "transaction_id": "TXN-001",

  "policy": {
    "policy_id": "POL-001",
    "policy_number": "POL-2026-001",
    "product_id": "PROD-001"
  },

  "parties": {
    "insured_id": "INS-001",
    "broker_id": "BRK-001",
    "carrier_id": "CAR-001",
    "mga_id": "MGA-001"
  },

  "financials": {
    "premium": 100000,
    "tax": 18000,
    "broker_commission": 10000,
    "currency": "INR"
  },

  "dates": {
    "effective_date": "2026-08-29",
    "transaction_date": "2026-08-29"
  },

  "source_system": "PAS"
}
```

Accounting & Finance consumes this event and processes it according to configured accounting rules.

---

# 7. Event Types

The Accounting & Finance module should support multiple event categories.

## 7.1 Policy Events

```text
POLICY_CREATED
POLICY_BOUND
POLICY_ISSUED
POLICY_RENEWED
POLICY_CANCELLED
POLICY_REINSTATED
POLICY_EXPIRED
```

---

## 7.2 Premium Events

```text
PREMIUM_BOOKED
PREMIUM_ADJUSTED
PREMIUM_REFUNDED
PREMIUM_REVERSED
```

---

## 7.3 Billing Events

```text
INVOICE_CREATED
INVOICE_UPDATED
INVOICE_CANCELLED
INVOICE_DUE
CREDIT_NOTE_CREATED
DEBIT_NOTE_CREATED
```

---

## 7.4 Payment Events

```text
PAYMENT_RECEIVED
PAYMENT_ALLOCATED
PAYMENT_FAILED
PAYMENT_REVERSED
PAYMENT_REFUNDED
```

---

## 7.5 Commission Events

```text
COMMISSION_CALCULATED
COMMISSION_ADJUSTED
COMMISSION_APPROVED
COMMISSION_PAID
```

---

## 7.6 Carrier Settlement Events

```text
CARRIER_PAYABLE_CREATED
CARRIER_SETTLEMENT_CALCULATED
CARRIER_PAYMENT_INITIATED
CARRIER_PAYMENT_COMPLETED
```

---

# 8. Accounting & Finance Processing Flow

Once an event is received from PAS, Accounting & Finance follows this process.

```text
PAS Event Received
        │
        ▼
Event Validation
        │
        ▼
Duplicate Check
        │
        ▼
Accounting Rule Identification
        │
        ▼
Journal Entry Generation
        │
        ▼
Subledger Update
        │
        ▼
General Ledger Posting
        │
        ▼
Reconciliation
        │
        ▼
Financial Reporting
```

---

# 9. Step 1 – Event Intake

Accounting & Finance receives an event from PAS.

Example:

```text
Event Type:
POLICY_BOUND

Policy:
POL-001

Premium:
₹100,000

Tax:
₹18,000

Broker Commission:
₹10,000
```

The event is stored before processing.

Recommended statuses:

```text
RECEIVED
VALIDATED
PROCESSING
POSTED
FAILED
REVERSED
```

---

# 10. Step 2 – Validation

The system validates the transaction before accounting.

Validation checks include:

```text
✓ Event ID exists
✓ Transaction ID exists
✓ Transaction is not duplicated
✓ Policy exists
✓ Product exists
✓ Currency exists
✓ Amounts are valid
✓ Dates are valid
✓ Accounting period is open
✓ Required parties exist
```

If validation fails:

```text
PAS Event
    │
    ▼
Validation Failed
    │
    ▼
Exception Queue
    │
    ▼
Manual Review / Retry
```

---

# 11. Step 3 – Accounting Rules Engine

The Accounting Rules Engine determines how the transaction should be posted.

Example rule:

```text
Event Type:
PREMIUM_BOOKED

Debit Account:
Accounts Receivable

Credit Account:
Premium Revenue
```

Another rule:

```text
Event Type:
COMMISSION_CALCULATED

Debit Account:
Commission Expense

Credit Account:
Commission Payable
```

Rules should be configurable.

Recommended rule dimensions:

```text
Event Type
Product
Coverage
Entity
Carrier
Jurisdiction
Transaction Type
Currency
```

---

# 12. Chart of Accounts

Accounting & Finance owns the Chart of Accounts.

Example:

```text
1000 Assets
│
├── 1100 Cash
├── 1200 Accounts Receivable
└── 1300 Other Receivables

2000 Liabilities
│
├── 2100 Accounts Payable
├── 2200 Tax Payable
├── 2300 Broker Commission Payable
└── 2400 Carrier Payable

4000 Revenue
│
├── 4100 Premium Revenue
├── 4200 Fee Revenue
└── 4300 Other Revenue

5000 Expenses
│
├── 5100 Commission Expense
├── 5200 Operating Expense
└── 5300 Claims Expense
```

The exact Chart of Accounts depends on the business model.

---

# 13. Journal Entry Processing

Example policy transaction:

```text
Premium:             ₹100,000
Tax:                  ₹18,000
Broker Commission:    ₹10,000
```

## Journal Entry 1 – Invoice / Premium

```text
DR  Accounts Receivable         ₹118,000
    CR  Premium Revenue         ₹100,000
    CR  Tax Payable              ₹18,000
```

## Journal Entry 2 – Commission

```text
DR  Commission Expense          ₹10,000
    CR  Commission Payable      ₹10,000
```

Every Journal Entry should contain:

```text
Journal Entry ID
Transaction ID
Event ID
Accounting Date
Posting Date
Description
Currency
Source System
Status
```

Each Journal Entry Line should contain:

```text
Account ID
Debit Amount
Credit Amount
Party
Policy ID
Product ID
Carrier ID
Broker ID
```

---

# 14. Accounts Receivable

Accounts Receivable tracks money owed to the organization.

Example:

```text
Invoice Number: INV-001

Premium:       ₹100,000
Tax:            ₹18,000
------------------------
Total:         ₹118,000
```

Accounting entry:

```text
DR Accounts Receivable   ₹118,000
    CR Premium Revenue   ₹100,000
    CR Tax Payable        ₹18,000
```

AR lifecycle:

```text
Invoice Created
      │
      ▼
OPEN
      │
      ▼
PARTIALLY PAID
      │
      ▼
PAID
```

Possible statuses:

```text
OPEN
PARTIALLY_PAID
PAID
OVERDUE
CANCELLED
WRITTEN_OFF
```

---

# 15. Payment Processing

When payment is received, PAS sends:

```text
PAYMENT_RECEIVED
```

Example:

```text
Invoice ID: INV-001
Payment Amount: ₹118,000
Payment Date: 2026-09-15
```

Accounting entry:

```text
DR Cash / Bank               ₹118,000
    CR Accounts Receivable   ₹118,000
```

The invoice balance becomes:

```text
Before Payment: ₹118,000

Payment:       ₹118,000

Remaining:     ₹0
```

Invoice status:

```text
PAID
```

---

# 16. Accounts Payable

Accounts Payable tracks money the organization owes to external parties.

Examples:

- Broker commissions
- Carrier settlements
- Vendors
- Taxes

Example:

```text
Broker Commission: ₹10,000
```

Accounting entry:

```text
DR Commission Expense       ₹10,000
    CR Commission Payable   ₹10,000
```

When payment is made:

```text
DR Commission Payable       ₹10,000
    CR Cash / Bank          ₹10,000
```

---

# 17. Carrier Settlement

The Accounting & Finance module should track amounts owed to carriers.

Example:

```text
Premium Collected:
₹100,000

Broker Commission:
₹10,000

MGA Fee:
₹5,000

Amount Payable to Carrier:
₹85,000
```

Carrier settlement lifecycle:

```text
Settlement Calculated
        │
        ▼
Carrier Payable Created
        │
        ▼
Settlement Approved
        │
        ▼
Payment Initiated
        │
        ▼
Payment Completed
        │
        ▼
Reconciled
```

---

# 18. General Ledger

The General Ledger receives posted accounting entries.

Flow:

```text
Business Event
      │
      ▼
Accounting Rule
      │
      ▼
Journal Entry
      │
      ▼
Journal Entry Posted
      │
      ▼
General Ledger
```

The GL provides balances for financial reporting.

Example:

```text
Account: Accounts Receivable

Opening Balance:      ₹500,000
New Invoices:         ₹118,000
Payments Received:   -₹100,000
--------------------------------
Closing Balance:      ₹518,000
```

---

# 19. Reconciliation

The system should support reconciliation between different systems and balances.

## Policy vs Accounting

```text
PAS Premium
     │
     ▼
Accounting Premium
```

## Invoice vs Payment

```text
Invoice Amount
     │
     ▼
Payment Amount
```

## Bank vs Accounting

```text
Bank Statement
      │
      ▼
Cash Ledger
```

## Carrier Settlement

```text
PAS Transactions
       │
       ▼
Carrier Payable
       │
       ▼
Carrier Statement
```

Reconciliation statuses:

```text
MATCHED
PARTIALLY_MATCHED
UNMATCHED
EXCEPTION
```

---

# 20. Financial Reporting

The Accounting & Finance module should support:

```text
General Ledger Report
Trial Balance
Balance Sheet
Profit and Loss
Cash Flow Statement
Accounts Receivable Aging
Accounts Payable Aging
Commission Report
Carrier Settlement Report
Premium Report
Tax Liability Report
```

Example AR Aging:

```text
Current       ₹500,000
1-30 Days     ₹200,000
31-60 Days    ₹100,000
61-90 Days     ₹50,000
90+ Days       ₹25,000
```

---

# 21. Complete End-to-End Example

## Step 1 – Product Studio

A product is configured:

```text
Product:
Commercial Insurance

Coverage:
General Liability

Base Premium:
₹100,000
```

---

## Step 2 – Underwriting

The risk is evaluated.

```text
Risk Status:
APPROVED
```

---

## Step 3 – Rater

The Rater calculates:

```text
Premium:             ₹100,000
Tax:                  ₹18,000
Broker Commission:    ₹10,000
```

---

## Step 4 – PAS

PAS creates and binds the policy.

```text
Policy ID:
POL-001

Policy Status:
BOUND
```

PAS generates the business event:

```text
POLICY_BOUND
```

---

## Step 5 – Accounting & Finance Receives Event

```text
POLICY_BOUND

Policy: POL-001

Premium: ₹100,000
Tax: ₹18,000
Commission: ₹10,000
```

---

## Step 6 – Invoice and AR

Invoice:

```text
Premium: ₹100,000
Tax: ₹18,000
--------------------
Total: ₹118,000
```

Journal Entry:

```text
DR Accounts Receivable    ₹118,000
    CR Premium Revenue    ₹100,000
    CR Tax Payable         ₹18,000
```

---

## Step 7 – Commission

```text
DR Commission Expense      ₹10,000
    CR Commission Payable  ₹10,000
```

---

## Step 8 – Payment Received

Customer/Broker pays:

```text
₹118,000
```

Journal Entry:

```text
DR Cash / Bank             ₹118,000
    CR Accounts Receivable ₹118,000
```

---

## Step 9 – Commission Paid

```text
DR Commission Payable      ₹10,000
    CR Cash / Bank         ₹10,000
```

---

## Step 10 – Reconciliation

The system verifies:

```text
PAS Transaction
      =
Accounting Transaction
      =
Invoice
      =
Payment
      =
Bank Record
```

If all records match:

```text
Status: RECONCILED
```

---

# 22. Complete Financial Lifecycle

```text
POLICY CREATED
      │
      ▼
POLICY APPROVED
      │
      ▼
PREMIUM CALCULATED
      │
      ▼
POLICY BOUND
      │
      ▼
PAS GENERATES FINANCIAL EVENT
      │
      ▼
ACCOUNTING EVENT RECEIVED
      │
      ▼
VALIDATION
      │
      ▼
ACCOUNTING RULES APPLIED
      │
      ▼
JOURNAL ENTRY CREATED
      │
      ├───────────────┐
      ▼               ▼
AR/AP Created      GL Updated
      │               │
      └───────┬───────┘
              ▼
        PAYMENT RECEIVED
              │
              ▼
        CASH UPDATED
              │
              ▼
       RECEIVABLE CLEARED
              │
              ▼
       PAYABLES PROCESSED
              │
              ▼
         RECONCILIATION
              │
              ▼
          PERIOD CLOSE
              │
              ▼
      FINANCIAL REPORTING
```

---

# 23. Recommended System Boundaries

The responsibilities should remain clearly separated.

## PAS Owns

```text
Policy Lifecycle
Policy Status
Policy Transactions
Billing Operations
Invoices
Payment Status
Customer Information
Policy Endorsements
Policy Cancellations
```

## Accounting & Finance Owns

```text
Chart of Accounts
Accounting Rules
Journal Entries
Journal Posting
Accounts Receivable
Accounts Payable
General Ledger
Cash Ledger
Commission Accounting
Carrier Settlement Accounting
Reconciliation
Financial Reporting
Period Close
```

---

# 24. Key Integration Principle

The integration should follow this rule:

```text
PAS = Business Source of Truth

Accounting & Finance = Financial Source of Truth
```

PAS answers:

> What happened to the policy?

Accounting & Finance answers:

> What is the financial and accounting impact of that event?

Example:

```text
PAS:
Policy POL-001 was bound.
Premium = ₹100,000.
```

Accounting & Finance:

```text
Determine:

• Is revenue recognized?
• Is there an invoice?
• Is AR created?
• Is tax payable?
• Is commission payable?
• Which GL accounts are affected?
• What Journal Entries should be posted?
```

---

# 25. Final Architecture Summary

```text
                        PRODUCT STUDIO
                              │
                              ▼
                        UNDERWRITING
                              │
                              ▼
                            RATER
                              │
                              │
                       Premium / Fees
                       Taxes / Commission
                              │
                              ▼
                            PAS
                              │
                    ┌─────────┴─────────┐
                    │                   │
             Policy Events        Financial Events
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ACCOUNTING & FINANCE
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
               AR            AP            JE
                │             │             │
                └─────────────┼─────────────┘
                              ▼
                       GENERAL LEDGER
                              │
                              ▼
                       RECONCILIATION
                              │
                              ▼
                     FINANCIAL REPORTING
```

---

# Final Principle

The most important architectural principle of this platform is:

```text
Product Studio
Defines what can be sold.

Underwriting
Decides whether it can be sold.

Rater
Calculates how much it costs.

PAS
Manages what happened to the policy.

Accounting & Finance
Records the financial impact of what happened.
```

This separation ensures that each module has a clear responsibility while maintaining a clean, scalable integration architecture.