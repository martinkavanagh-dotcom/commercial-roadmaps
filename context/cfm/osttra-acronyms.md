---

## id: doc-acronyms-001 title: "OSTTRA Master Acronyms & Terminology Glossary" category: "glossary" portfolio\_status: "active\_core" claim\_status: "shipped" commercial\_lead: "Nathan Ondyak" first\_defence\_approver: "John Kenchington" last\_reviewed: 2026-10-26 validation\_status: "unvalidated\_baseline" governance: chinese\_wall\_verified: true editorial\_lint: "passed" git\_commit: "c8ae608" body\_sha256: "975c44cd7c1443f23d4d93715387f284f844cf7993aea930cd1d3f64c4273407"

# OSTTRA Acronyms & Proprietary Glossary

*Knowledge Hub Reference \| Single Source of Truth for Enterprise & Market Terminology* *Scope: 39 Proprietary Technologies & 96 Standard Financial Market Terms (135 Total)*

---

## 1\. Proprietary Technology & Internal Projects (Table 1\)

| Term / Acronym | Applicable Asset Classes | Full Name / Description | Functional Benefit |
| :---- | :---- | :---- | :---- |
| **Alpine** | Infrastructure / Cross-Asset | Unified Onboarding. | The central orchestration layer for the OSTTRA ecosystem. It facilitates digital onboarding for new clients, reverse onboarding for existing clients, and integrates with third-party platforms (e.g., Saphyre, OA) to provide a single source of truth for static data. |
| **Apigee / Apigee X** | Infrastructure / Cross-Asset | OSTTRA's chosen API Gateway and centralised API hosting platform built on GCP technology. | Provides a single entry point for API exposure, standardising security (authentication/authorisation), traffic management (rate/quota limiting), and monetisation. |
| **CCPC FX (or CCPC)** | FX | OSTTRA's proprietary Central Counterparty Clearing connectivity platform/module. | Supports messaging and automated workflows required by participants involved in central clearing (including block-level and client clearing). |
| **CFM (Cash Flow Management)** | Equities, Cross-Asset | OSTTRA's market utility for pre-agreement settlement orchestration across all asset classes / Cash Flow Management platform. | Acts as a centralised hub to view, affirm, and net alleged cashflows across over 70 ISITC cashflow types across all asset classes, feeding confirmed flows directly to internal payment systems for automated STP settlement. |
| **CRDS (Client Reference Data Services)** | FX, Equities | Client Reference Data Services (CRDS). | A single, authoritative source of truth for customer reference data. It eliminates the need for siloed management layers by providing a self-service platform with built-in auditing, reporting, and 4-eyes checks for Traiana products and new services (such as Equity Swaps). |
| **CreditLink** | FX | OSTTRA CreditLink is Traiana's real-time credit monitoring and control service for the tri-party brokerage community. | Serves as the trusted credit-risk management engine for FX prime brokerage. It provides real-time visibility into credit limit utilisation and an ultra-low latency credit "kill switch". |
| **Developer Portal** | Infrastructure / Cross-Asset | OSTTRA's external centralised API catalogue (developer.osttra.com), built using Drupal. | Hosts API documentation and sandbox environments for prospects to explore APIs without an active subscription, integrating with Salesforce for lead generation. |
| **DMS (including DMS Daas)** | FX | OSTTRA's proprietary core data management and enablement system. | Integrates core trade data with dashboards to provide clients with insights into key performance metrics across Rates, Credit, and Equities. |
| **DNM** | FX | Designation Notice Manager. | A legacy Traiana service that helps FX Prime Brokers establish, monitor, amend, and terminate FX Tri-Party agreements. |
| **Docubot (or Dot)** | FX | Dot (DocuBot) is OSTTRA's proprietary digital assistance tool. | Enables employees and clients to quickly search and retrieve technical documentation. |
| **ELC** | Infrastructure / Cross-Asset | Externalisation Lifecycle. | The operational framework used to build an end-to-end proxy setup, allowing internal services to be securely published as APIs on the public internet. |
| **EM (Software)** | Rates, Credit | Exception Management (EM) is a proprietary project module managed within OSTTRA's CSM portfolio. | Designed to provide automated exception workflows to highlight cash flow breaks and discrepancies. |
| **Equity Portfolio Swaps** | Equities | OSTTRA's post-trade management programme spanning T0 and T+ lifecycles for prime-brokered equity swaps. | Brings end-to-end visibility and post-trade transparency across lifecycle management, reconciliation, and settlements. |
| **OSTTRA Connect for ETD (ClientLink)** | Equities, ETD | OSTTRA Connect middle-office allocation matching and clearing platform for exchange-traded derivatives (formerly ETD ClientLink). | Coordinates client trade allocation instructions and returns real-time clearing statuses, solving the "IMC blindspot". |
| **FX PvP Settlement (Diamond PvP)** | FX | OSTTRA's bilateral settlement orchestration service backed by Baton Systems and DLT technology. | Provides on-demand, intra-day netting and settlement orchestration to mitigate Herstatt risk and optimise liquidity. |
| **Jigsaw** | FX, Equities, Post-Trade | OSTTRA's proprietary central data storage and enablement platform. | Facilitates the central storage of live positions and enables bulk generation of cashflows and valuations across downstream post-trade lifecycle systems. |
| **JRDS** | Infrastructure / Cross-Asset | Jigsaw Reference Data Store / Service. | The central identity management translator. It stores unique IDs for institutions, users, and entities, enabling cross-platform identity validation and data interoperability without enforcing rigid centralisation. |
| **LimitHub** | Post-Trade | OSTTRA's centralised limit checking and pre-trade clearing certainty platform. | Provides clearing brokers and clients with real-time visibility of credit limit utilisation consolidated across multiple venues. |
| **OSTTRA Connect for Rates (MarkitWire)** | Rates, Credit | OSTTRA Connect trade processing, confirmation, and affirmation platform for OTC interest rate derivatives and credit derivatives (MarkitWire). | Serves as the core post-trade processing engine and central repository for OTC derivatives transactions. |
| **OSTTRA Connect for FXPB (Message Center)** | FX | OSTTRA Connect messaging middleware and GUI system designed to normalise, transform, and route transaction data for FX prime brokerage (Message Center). | Automates the matching, affirmation, and allocation workflows by translating complex message formats. |
| **NetLink** | FX | Traiana's proprietary rules-based FX netting and aggregation system. | Drives trading efficiency by aggregating and netting FX transactions, with secondary support for incidental post-trade connectivity and routing. |
| **ODC** | FX | OSTTRA Documentation Centre. | A document store for prime-brokerage agreements that govern trading arrangements such as give-ups. It extends and replaces the legacy capabilities of DNM. |
| **OSTTRA API Hub** | Infrastructure / Cross-Asset | OSTTRA's cohesive API ecosystem. | A central platform for developing, managing, and utilising APIs internally and externally, decoupling consumers from backend services to minimise downtime. |
| **OSTTRA Digital Assistant** | Equities, Post-Trade | OSTTRA's natural language documentation assistant. | Allows clients to search and interrogate UI documentation in real time, automatically routing unresolved queries to the IT Service Desk. |
| **OSTTRA Reset** | Post-Trade | OSTTRA's portfolio basis risk reduction service (formerly Reset). | Enables traders to offset basis risks by holding multilateral matching sessions and generating risk-offsetting trades. |
| **OTM** | Cross-Asset | OSTTRA Trade Manager. | The consolidated User Interface (UI) for MarkitSERV platform services, supporting cross-asset trade management. |
| **PRF** | Cross-Asset | Product Refinement Forum. | Collaborative product and engineering forums where the development pipeline, sprint backlogs, and roadmap adjustments are worked out across shared platforms (e.g. MarkitWire). |
| **SSO** | FX, Infrastructure | Single Sign-On. | OSTTRA's integrated authentication service secured via Microsoft Entra. |
| **OSTTRA Connect for FX (TradeServ FX)** | FX | OSTTRA Connect cloud-based post-trade processing, confirmation, and lifecycle platform for FX transactions (TradeServ FX). | Acts as a core platform for processing FX transaction data and facilitating real-time validated data feeds. |
| **TradeSTP / FX BA / SignalHub** | FX | OSTTRA's proprietary FX straight-through processing system, FX Business Analytics (FX BA), and SignalHub. | Enables a fully automated, end-to-end post-trade workflow from execution down to settlement without manual intervention, backed by commercial business analytics. |
| **OSTTRA Rebalance (formerly triBalance)** | FX, Post-Trade | OSTTRA's portfolio rebalancing service (formerly triBalance). | Reduces credit risk, bilateral MTM exposure, and initial margin (IM) requirements by rebalancing portfolios. |
| **OSTTRA Calculate (formerly triCalculate)** | FX, Post-Trade | OSTTRA's high-performance valuation, risk, and XVA analytics engine (formerly triCalculate). | Generates exposure profiles, XVA sensitivities, and pre-deal margin/risk checks for OTC derivatives. |
| **OSTTRA Margin (formerly triResolve Margin / triMargin)** | Post-Trade | OSTTRA's end-to-end collateral management and margin process service (formerly triResolve Margin / triMargin). | Automates the margin call lifecycle across cleared and uncleared OTC derivatives. |
| **OSTTRA Reduce (formerly triReduce)** | FX, Post-Trade | OSTTRA's multilateral portfolio compression service (formerly triReduce). | Enables market participants to compress and eliminate gross notional exposure and line items without altering market risk. |
| **OSTTRA Resolve (formerly triResolve)** | FX, Post-Trade | OSTTRA's market-standard portfolio reconciliation and dispute management service (formerly triResolve). | Reconciles client positions, balances, and margin call workflows against clearing broker data to mitigate risk. |
| **TRM** | FX | Trading Relationship Management. | Traiana's legacy solution suite for integrating counterparties, automating trade processes, and managing trading relationships in FX. |
| **TRV (Trade Record & Valuations)** | Post-Trade | Trade Record & Valuations project. | Delivers projected cash flows, PV, and risk data on a trade-by-trade basis for MarkitWire's non-cleared Rates trade data. |
| **UDO (Unified Digital Onboarding)** | FX | Unified Digital Onboarding (UDO) is OSTTRA's proprietary onboarding enabler system. | Automates and streamlines the customer onboarding process, supporting strategic growth initiatives. |

---

## 2\. Standard Financial Market Terms & Instruments (Table 2\)

| Market Acronym | Applicable Asset Classes | Standard Financial Meaning |
| :---- | :---- | :---- |
| **ABAC** | Infrastructure | Attribute-Based Access Control (A security model that evaluates attributes or characteristics to determine access rights). |
| **AI** | Equities | Artificial Intelligence (The application of advanced algorithms to automate trade matching and exception predictions). |
| **API** | FX | Application Programming Interface (A software intermediary that allows two financial applications to interact). |
| **APS** | Equities | Advanced Portfolio System (A third-party portfolio management service integrated via FIS). |
| **AWS** | Equities | Amazon Web Services (A comprehensive, highly secure cloud computing platform used for infrastructure hosting). |
| **BBG** | Equities | Bloomberg (The industry-standard global financial news, data analytics, and ticker symbology identifier platform). |
| **BI** | Equities | Business Intelligence (The applications and processes used to analyse datasets and present actionable metrics to clients). |
| **Block** | FX | Block Trade (A large-scale transaction or order executed outside open market venues to minimise price impact). |
| **BRL** | Rates, Credit, Post-Trade | Brazilian Real (The official fiat currency of Brazil). |
| **Bullion** | FX | Precious Metals (Physical gold, silver, platinum, or palladium held in bulk form, typically traded as currency-commodity pairs). |
| **C2C** | FX | Client-to-Client / Customer-to-Customer (A trading or execution model where client orders are matched directly against other client orders). |
| **CCP** | Rates, Credit, Equities | Central Counterparty (An independent clearing house that acts as the buyer to every seller and seller to every buyer to mitigate counterparty risk). |
| **ccy** | Post-Trade | Currency (Standard financial abbreviation representing fiat or digital currency units). |
| **CFD** | Equities | Contract for Difference (An OTC equity derivative contract where counterparties exchange the price difference of an underlying equity asset). |
| **Chekmarx** | Infrastructure | Checkmarx Application Security Testing (A third-party enterprise application security tool used to scan source code for vulnerabilities and manage security debt). |
| **CI/CD** | Infrastructure | Continuous Integration / Continuous Deployment (Automated software delivery pipelines). |
| **CLS** | Rates, Credit | Continuous Linked Settlement (A global multi-currency cash settlement system that mitigates settlement risk for foreign exchange transactions). |
| **CME** | Rates, Credit, Post-Trade | Chicago Mercantile Exchange (A major global derivatives exchange and clearing house/CCP). |
| **Convexity** | Post-Trade | Convexity (A measure of the non-linear curvature relationship between interest rates and bond prices, or the rate of change of duration). |
| **COP** | Rates, Credit | Colombian Peso (The official fiat currency of Colombia). |
| **CSV** | FX | Comma-Separated Values (A standard flat file format used to transmit structured tabular data). |
| **Django** | Infrastructure | Django Web Framework (A high-level, third-party Python web framework used for rapid backend development and secure web design). |
| **DV01** | Post-Trade | Dollar Value of an 1 Basis Point (A standard market risk metric representing the price sensitivity to a one basis point change in interest rates). |
| **EB** | FX | Executing Broker (The broker that executes a transaction on behalf of a client, which is subsequently given up to a Prime Broker for clearing). |
| **ECN** | FX | Electronic Communication Network (An automated trading system that matches buy and sell orders for financial instruments). |
| **EM** | Rates, Credit, Equities | Emerging Markets (Refers to emerging market countries, currencies, or inflation-protected instruments such as the Brazilian Real or Colombian Peso). |
| **EMIR** | Post-Trade | European Market Infrastructure Regulation (A body of European Union regulations designed to increase transparency and reduce counterparty risk). |
| **ETD** | Equities, Post-Trade | Exchange Traded Derivatives (Standardised futures and options contracts cleared and traded on regulated exchanges). |
| **EUR** | Post-Trade | Euro (The official currency of the European Union). |
| **FCM** | Equities | Futures Commission Merchant (An institution that solicits or accepts orders for futures/options on an exchange and accepts customer collateral). |
| **FIS** | Equities | Fidelity National Information Services / FIS (A global financial technology partner supplying gateway clearing connectivity). |
| **FOW** | Market Data | Futures & Options World (A standard industry data feed providing reference data, instrument specs, and pricing for global derivatives). |
| **FRA** | Post-Trade | Forward Rate Agreement (An OTC forward contract in which counterparties agree on an interest rate to be paid on a future settlement date). |
| **FXO** | FX | FX Option / Foreign Exchange Option (A derivative contract giving the right to exchange currencies at a specified rate on a specified date). |
| **GBP** | Post-Trade | Great British Pound (The official currency of the United Kingdom). |
| **GMRA** | Post-Trade | Global Master Repurchase Agreement (The standard bilateral legal contract structure used to govern international repo transactions). |
| **gRPC** | Infrastructure | gRPC Remote Procedure Calls (A high-performance, open-source universal RPC framework). |
| **GUI** | FX, Equities | Graphical User Interface (The visual system and interactive screens through which users navigate a software application). |
| **HUF** | Rates, Credit, Post-Trade | Hungarian Forint (The official fiat currency of Hungary). |
| **IaC** | Infrastructure | Infrastructure as Code (The process of managing and provisioning computing infrastructure through machine-readable definition files). |
| **ICSA** | Equities | International Council of Securities Associations (A trade association representing the securities industry, involved in standardising bespoke transformers for client workflows). |
| **IM** | Post-Trade | Initial Margin (Collateral posted to cover potential future exposure during the liquidation period in the event of a counterparty default). |
| **IMC** | Cross-Asset | Investment Management Community (OSTTRA's collective term for the panoply of buy-side firms, including hedge funds, asset managers, platforms, and outsourced middle-office providers). |
| **IRS** | Rates, Credit | Interest Rate Swap (An OTC derivative contract where counterparties exchange interest rate cash flows based on a specified notional amount). |
| **ISDA** | Equities | International Swaps and Derivatives Association (The global trade association that governs standard documentation and contract templates for OTC derivatives). |
| **ISIN** | Rates, Credit | International Securities Identification Number (A unique 12-character global identifier for financial securities). |
| **JDK** | Equities | Java Development Kit (A software development environment utilised to compile and deploy Java applications). |
| **JIBAR** | Rates, Credit | Johannesburg Interbank Agreed Rate (The benchmark interest rate for South African Rand money markets). |
| **JTD** | Post-Trade | Jump-to-Default (A standard credit risk metric representing the sudden loss in value triggered by the immediate default of an obligor). |
| **KPI** | Post-Trade | Key Performance Indicator (Quantifiable metrics used to measure operational health, performance, and SLA compliance). |
| **KRW** | Rates, Credit, Post-Trade | South Korean Won (The official fiat currency of South Korea). |
| **LCH** | Rates, Credit, Post-Trade | London Clearing House (A major global clearing house and central counterparty supporting rates and package trade clearing). |
| **MCA** | Equities | Master Confirmation Agreement (An industry-standard contract structure under ISDA that governs multiple individual OTC transaction confirmations). |
| **MIS** | Equities | Management Information System (Information technology systems designed to collect business metrics and generate dashboards). |
| **MTA** | Post-Trade | Minimum Transfer Amount (The minimum collateral transfer threshold defined in a collateral agreement). |
| **MYR** | Post-Trade | Malaysian Ringgit (The official fiat currency of Malaysia). |
| **ND** | Post-Trade | Non-Deliverable (Cash-settled financial structures where no physical delivery of the underlying currency or asset occurs). |
| **NDF** | FX, Post-Trade | Non-Deliverable Forward (An OTC foreign exchange derivative contract settled in a convertible currency"”usually USD). |
| **NDO** | FX | Non-Deliverable Option (An OTC foreign exchange option settled in a convertible currency, typically for non-convertible currencies). |
| **OA** | FX | Option Allocation / Option Assignment (A standard process for distributing option trades to client accounts or triggering exercises). |
| **OA (Platform)** | Infrastructure | OA (A third-party static data management platform/application integrated with OSTTRA's onboarding ecosystem). |
| **OIS** | Rates, Credit | Overnight Indexed Swap (An interest rate swap where the floating leg is tied to an overnight risk-free reference rate). |
| **PB** | FX, Equities | Prime Broker / Prime Brokerage (A financial institution that provides bundled credit lending, execution, and clearing services). |
| **PEN** | Rates, Credit, Post-Trade | Peruvian Sol (The official fiat currency of Peru; Sol represents the currency unit). |
| **PLN** | Rates, Credit, FX | Polish Zloty (The official fiat currency of Poland). |
| **POLSTR** | Rates, Credit | Polish Overnight Local Standard Rate (The standard overnight risk-free reference rate for the Polish Zloty market). |
| **PROD** | FX | Production (The live environment where software applications and financial platforms run transactions for real-time operations). |
| **PX** | Equities | Price (A standard market abbreviation representing transaction or execution price). |
| **RBAC** | Infrastructure | Role-Based Access Control (A security model that restricts system access based on a user's role within an organisation). |
| **RFR** | Rates, Credit | Risk Free Rate (The theoretical rate of return of an investment with zero risk, serving as the basis for benchmark reform). |
| **SA-CCR** | Post-Trade | Standardised Approach for Counterparty Credit Risk (The standardised methodology used to calculate exposure under Basel capital rules). |
| **SAIBOR** | Rates, Credit | Saudi Arabian Interbank Offered Rate (The benchmark interest rate for the Saudi Arabian Riyal market). |
| **SAP** | Post-Trade | Systems, Applications, and Products in Data Processing (A major global enterprise resource planning software suite). |
| **Saphyre** | Infrastructure | Saphyre (A third-party onboarding accelerator and data management tool integrated into OSTTRA's Alpine ecosystem to speed up client onboarding). |
| **SAR** | Rates, Credit, Post-Trade | Saudi Arabian Riyal (The official fiat currency of Saudi Arabia). |
| **SBOM** | Infrastructure | Software Bill of Materials (A comprehensive, machine-readable inventory of all software components, dependencies, and libraries used in an application, critical for cybersecurity audits). |
| **SFTP** | Rates, Credit, Post-Trade | Secure File Transfer Protocol (A secure network protocol used for transmitting large custom reports securely between systems). |
| **SSI** | Post-Trade | Standard Settlement Instructions (The standardised financial details used to execute cash and asset settlements). |
| **STP** | Rates, Credit, FX | Straight-Through Processing (Fully automated end-to-end processing of financial transactions without manual intervention). |
| **SWIFT** | FX | Society for Worldwide Interbank Financial Telecommunication (The global messaging network used by financial institutions). |
| **TAS** | Equities | Trade at Settlement (An exchange transaction type allowing participants to execute trades at the day's official settlement price). |
| **TDN** | Equities | Trade Data Network (FIA Tech's market utility platform backed by major FCMs). |
| **TiDB** | Infrastructure | TiDB Distributed SQL Database (An open-source, third-party NewSQL database designed to handle high transaction volumes and real-time analytics). |
| **TIW** | Rates, Credit | Trade Information Warehouse (DTCC's central repository and registry for credit default swaps). |
| **UAT** | FX | User Acceptance Testing (The final phase of software testing where actual clients or business users verify the system). |
| **UI** | Rates, Credit, Equities | User Interface (The visual system and screens through which clients interact with a software application). |
| **USD** | Post-Trade | United States Dollar (The official currency of the United States). |
| **USD-AXI** | Rates, Credit | USD Ameribor Term Index (An interest rate benchmark designed to reflect actual unsecured borrowing costs for US banks). |
| **USD-FXI** | Rates, Credit | USD FX Implied rate Index (A benchmark reflecting implied interest rates derived from foreign exchange pricing). |
| **UTI / USI** | Post-Trade | Unique Trade Identifier / Unique Swap Identifier (Regulatory identifiers used to track derivatives trades across repositories). |
| **Vega** | FX | Vega (A standard option Greek representing the sensitivity of an option's contract value to volatility changes). |
| **VM** | Post-Trade | Variation Margin (Collateral exchanged daily to reflect mark-to-market fluctuations in open positions). |
| **XML** | FX | Extensible Markup Language (A standard text-based data format used to structure and exchange financial messages). |
| **XVA** | Post-Trade | Valuation Adjustments (Collective term for valuation adjustments in OTC derivatives, comprising CVA, DVA, FVA, MVA, KVA). |
| **ZARONIA** | Rates, Credit | South African Rand Overnight Index Average (Standard overnight risk-free reference rate for the ZAR market). |
| **ZC** | Rates, Credit | Zero Coupon (A financial instrument structure that does not make periodic interest payments). |

&nbsp;