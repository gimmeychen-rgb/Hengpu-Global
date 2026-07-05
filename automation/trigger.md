# Automation Trigger System - Hengpu Global

## Purpose
This system determines WHEN and HOW AI tasks are executed.

---

## 1. Trigger Rules Engine

### Client Trigger
IF input.type == "Client Request"
THEN activate:
- pricing-model
- client analysis
- supplier matching

---

### Supplier Trigger
IF input.type == "Supplier Data"
THEN activate:
- supplier classification
- pricing update system
- risk evaluation

---

### Internal Trigger
IF input.type == "Internal Task"
THEN activate:
- market research
- strategic analysis
- workflow execution

---

## 2. Priority Rules

Priority Level:
1. Client Request (highest priority)
2. Internal Strategy
3. Supplier Updates

---

## 3. Automation Logic

IF request is high-value client:
→ activate pricing + client + supplier modules

IF request is standard inquiry:
→ activate pricing only

IF request is research:
→ activate AI analysis system

---

## 4. Core Principle

Do not execute randomly.

Every action must be:
- Classified
- Routed
- Processed via correct module
