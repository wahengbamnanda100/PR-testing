export type Domain = {
	id: number;
	name: string;
	uid: string;
	subDomains: SubDomain[];
};

export type SubDomain = {
	name: string;
	uid: string;
	services: Services[];
};

export type Services = {
	name: string;
	uid: string;
};

export const layout = {
	// Defines the visual columns of the landscape
	columns: [
		// Column 1: Business and Resource Management
		{
			domainNames: [
				"Corporate Relations",
				"Business Direction",
				"Corporate Services",
				"Unit Management",
				"Human Resources",
				"Platform Operations",
				"Buildings And Equipment",
			],
		},
		// Column 2: Finance, Risk, and Operations
		{
			domainNames: [
				"Financial Control",
				"Operational Risk",
				"Group Treasury",
				"Market Risk",
				"Credit Risk",
				"Compliance",
				"Clearing And Settlement",
				"Custody, Collateral And Documents",
				"Accounting Services",
				"Operational Services",
				"External Agency",
			],
		},
		// Column 3: Products
		{
			domainNames: [
				"Market Operations",
				"Corporate Finance",
				"Loans and Deposits",
				"Cards",
				"Market Trading",
				"Advisory Services",
				"Trade Banking",
				"Corporate Banking",
				"Consumer Banking",
			],
		},
		// Column 4: Customers
		{
			domainNames: [
				"Party Reference",
				"Investment Services",
				"Relationship Management",
				"Sales",
				"Customer Care",
			],
		},
		// Column 5: Channels
		{
			domainNames: [
				"Information Providers",
				"Cross Channel",
				"Channel Specific",
				"Servicing",
				"Distribution",
			],
		},
		// Column 6: Business Development (items from the bottom row of the original image)
		{
			domainNames: [
				"Intelectual Property And Knowledge",
				"Models And Analytics",
				"Solution Development",
				"Product Management",
				"Marketing And Development",
			],
		},
	],
};

export const domainData: Domain[] = [
	{
		id: 1,
		uid: "BIAN-13.0.0-BusinessManagement",
		name: "Business Management",
		subDomains: [
			{
				uid: "BIAN-13.0.0-CorporateServices",
				name: "Corporate Services",
				services: [
					{
						uid: "BIAN-13.0.0-ContinuityPlanning",
						name: "Continuity Planning",
					},
					{
						uid: "BIAN-13.0.0-InternalAudit",
						name: "Internal Audit",
					},
					{
						uid: "BIAN-13.0.0-SecurityAdvisory",
						name: "Security Advisory",
					},
					{
						uid: "BIAN-13.0.0-LegalCompliance",
						name: "Legal Compliance",
					},
					{
						uid: "BIAN-13.0.0-SecurityAssurance",
						name: "Security Assurance",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-CorporateRelations",
				name: "Corporate Relations",
				services: [
					{
						uid: "BIAN-13.0.0-CorporateCommunications",
						name: "Corporate Communications",
					},
					{
						uid: "BIAN-13.0.0-CorporateAllianceandStakeHolder",
						name: "Corporate Alliance and Stake Holder",
					},
					{
						uid: "BIAN-13.0.0-CorporateRelationship",
						name: "Corporate Relationship",
					},
					{
						uid: "BIAN-13.0.0-InvestorRelations",
						name: "Investor Relations",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-BusinessDirection",
				name: "Business Direction",
				services: [
					{
						uid: "BIAN-13.0.0-PropertyPortfolio",
						name: "Property Portfolio",
					},
					{
						uid: "BIAN-13.0.0-OrganizationDirection",
						name: "Organization Direction",
					},
					{
						uid: "BIAN-13.0.0-CorporateStrategy",
						name: "Corporate Strategy",
					},
					{
						uid: "BIAN-13.0.0-CorporatePolicies",
						name: "Corporate Policies",
					},
					{
						uid: "BIAN-13.0.0-ProductsandServicesDirection",
						name: "Products and Services Direction",
					},
					{
						uid: "BIAN-13.0.0-HumanResourcesDirection",
						name: "Human Resources Direction",
					},
					{
						uid: "BIAN-13.0.0-ITSystemsDirection",
						name: "IT Systems Direction",
					},
					{
						uid: "BIAN-13.0.0-AssetAndLiabilityManagement",
						name: "Asset And Liability Management",
					},
				],
			},
		],
	},
	{
		id: 7,
		uid: "BIAN-13.0.0-Customers",
		name: "Customers",
		subDomains: [
			{
				uid: "BIAN-13.0.0-PartyReference",
				name: "Party Reference",
				services: [
					{
						uid: "BIAN-13.0.0-LocationDataManagement",
						name: "Location Data Management",
					},
					{
						uid: "BIAN-13.0.0-LegalEntityDirectory",
						name: "Legal Entity Directory",
					},
					{
						uid: "BIAN-13.0.0-PartyReferenceDataDirectory",
						name: "Party Reference Data Directory",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-Sales",
				name: "Sales",
				services: [
					{
						uid: "BIAN-13.0.0-SpecialPricingConditions",
						name: "Special Pricing Conditions",
					},
					{
						uid: "BIAN-13.0.0-CustomerCampaignExecution",
						name: "Customer Campaign Execution",
					},
					{
						uid: "BIAN-13.0.0-ProductExpertSalesSupport",
						name: "Product Expert Sales Support",
					},
					{
						uid: "BIAN-13.0.0-CustomerOffer",
						name: "Customer Offer",
					},
					{
						uid: "BIAN-13.0.0-LeadandOpportunityManagement",
						name: "Lead and Opportunity Management",
					},
					{
						uid: "BIAN-13.0.0-PartyLifecycleManagement",
						name: "Party Lifecycle Management",
					},
					{
						uid: "BIAN-13.0.0-ProductMatching",
						name: "Product Matching",
					},
					{
						uid: "BIAN-13.0.0-ProductSalesSupport",
						name: "Product Sales Support",
					},
					{
						uid: "BIAN-13.0.0-ProspectCampaignExecution",
						name: "Prospect Campaign Execution",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-InvestmentServices",
				name: "Investment Services",
				services: [
					{
						uid: "BIAN-13.0.0-ConsumerInvestments",
						name: "Consumer Investments",
					},
					{
						uid: "BIAN-13.0.0-InvestmentPortfolioAnalysis",
						name: "Investment Portfolio Analysis",
					},
					{
						uid: "BIAN-13.0.0-eTradingWorkbench",
						name: "eTrading Workbench",
					},
					{
						uid: "BIAN-13.0.0-InvestmentPortfolioManagement",
						name: "Investment Portfolio Management",
					},
					{
						uid: "BIAN-13.0.0-InvestmentPortfolioPlanning",
						name: "Investment Portfolio Planning",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-RelationshipManagement",
				name: "Relationship Management",
				services: [
					{
						uid: "BIAN-13.0.0-CustomerAgreement",
						name: "Customer Agreement",
					},
					{
						uid: "BIAN-13.0.0-CustomerBehaviorInsights",
						name: "Customer Behavior Insights",
					},
					{
						uid: "BIAN-13.0.0-CustomerCreditRating",
						name: "Customer Credit Rating",
					},
					{
						uid: "BIAN-13.0.0-CustomerEventHistory",
						name: "Customer Event History",
					},
					{
						uid: "BIAN-13.0.0-CustomerFinancialInsights",
						name: "Customer Financial Insights",
					},
					{
						uid: "BIAN-13.0.0-CustomerProductandServiceDirectory",
						name: "Customer Product and Service Directory",
					},
					{
						uid: "BIAN-13.0.0-CustomerProductAndServiceEligibility",
						name: "Customer Product And Service Eligibility",
					},
					{
						uid: "BIAN-13.0.0-CustomerProposition",
						name: "Customer Proposition",
					},
					{
						uid: "BIAN-13.0.0-SalesProductAgreement",
						name: "Sales Product Agreement",
					},
					{
						uid: "BIAN-13.0.0-CustomerRelationshipManagement",
						name: "Customer Relationship Management",
					},
					{
						uid: "BIAN-13.0.0-LoanSyndication",
						name: "Loan Syndication",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-CustomerCare",
				name: "Customer Care",
				services: [
					{
						uid: "BIAN-13.0.0-CardCase",
						name: "Card Case",
					},
					{
						uid: "BIAN-13.0.0-CustomerCaseManagement",
						name: "Customer Case Management",
					},
					{
						uid: "BIAN-13.0.0-CustomerCase",
						name: "Customer Case",
					},
					{
						uid: "BIAN-13.0.0-ServicingMandate",
						name: "Servicing Mandate",
					},
					{
						uid: "BIAN-13.0.0-ServicingOrder",
						name: "Servicing Order",
					},
				],
			},
		],
	},
	{
		id: 3,
		uid: "BIAN-13.0.0-Channels",
		name: "Channels",
		subDomains: [
			{
				uid: "BIAN-13.0.0-ChannelSpecific",
				name: "Channel Specific",
				services: [
					{
						uid: "BIAN-13.0.0-FinancialGateway",
						name: "Financial Gateway",
					},
					{
						uid: "BIAN-13.0.0-ATMNetworkOperations",
						name: "ATM Network Operations",
					},
					{
						uid: "BIAN-13.0.0-AdvancedVoiceServicesOperations",
						name: "Advanced Voice Services Operations",
					},
					{
						uid: "BIAN-13.0.0-CardTerminalOperation",
						name: "Card Terminal Operation",
					},
					{
						uid: "BIAN-13.0.0-CardTerminalAdministration",
						name: "Card Terminal Administration",
					},
					{
						uid: "BIAN-13.0.0-BranchLocationOperations",
						name: "Branch Location Operations",
					},
					{
						uid: "BIAN-13.0.0-eBranchOperations",
						name: "eBranch Operations",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-Servicing",
				name: "Servicing",
				services: [
					{
						uid: "BIAN-13.0.0-ContactCenterOperations",
						name: "Contact Center Operations",
					},
					{
						uid: "BIAN-13.0.0-InteractiveHelp",
						name: "Interactive Help",
					},
					{
						uid: "BIAN-13.0.0-PointofService",
						name: "Point of Service",
					},
					{
						uid: "BIAN-13.0.0-ServiceDirectory",
						name: "Service Directory",
					},
					{
						uid: "BIAN-13.0.0-ServicingEventHistory",
						name: "Servicing Event History",
					},
					{
						uid: "BIAN-13.0.0-ServicingIssue",
						name: "Servicing Issue",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-CrossChannel",
				name: "Cross Channel",
				services: [
					{
						uid: "BIAN-13.0.0-ChannelActivityHistory",
						name: "Channel Activity History",
					},
					{
						uid: "BIAN-13.0.0-ProcessingOrder",
						name: "Processing Order",
					},
					{
						uid: "BIAN-13.0.0-PartyRoutingProfile",
						name: "Party Routing Profile",
					},
					{
						uid: "BIAN-13.0.0-ContactHandler",
						name: "Contact Handler",
					},
					{
						uid: "BIAN-13.0.0-ContactRouting",
						name: "Contact Routing",
					},
					{
						uid: "BIAN-13.0.0-CustomerWorkbench",
						name: "Customer Workbench",
					},
					{
						uid: "BIAN-13.0.0-PartyAuthentication",
						name: "Party Authentication",
					},
					{
						uid: "BIAN-13.0.0-SessionDialogue",
						name: "Session Dialogue",
					},
					{
						uid: "BIAN-13.0.0-TransactionAuthorization",
						name: "Transaction Authorization",
					},
					{
						uid: "BIAN-13.0.0-CustomerAccessEntitlement",
						name: "Customer Access Entitlement",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-InformationProviders",
				name: "Information Providers",
				services: [
					{
						uid: "BIAN-13.0.0-FinancialInstrumentReferenceDataManagement",
						name: "Financial Instrument Reference Data Management",
					},
					{
						uid: "BIAN-13.0.0-FinancialMarketAnalysis",
						name: "Financial Market Analysis",
					},
					{
						uid: "BIAN-13.0.0-FinancialMarketResearch",
						name: "Financial Market Research",
					},
					{
						uid: "BIAN-13.0.0-InformationProviderOperation",
						name: "Information Provider Operation",
					},
					{
						uid: "BIAN-13.0.0-MarketDataSwitchOperation",
						name: "Market Data Switch Operation",
					},
					{
						uid: "BIAN-13.0.0-MarketInformationManagement",
						name: "Market Information Management",
					},
					{
						uid: "BIAN-13.0.0-PublicReferenceDataManagement",
						name: "Public Reference Data Management",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-Distribution",
				name: "Distribution",
				services: [
					{
						uid: "BIAN-13.0.0-Correspondence",
						name: "Correspondence",
					},
					{
						uid: "BIAN-13.0.0-BranchCurrencyDistribution",
						name: "Branch Currency Distribution",
					},
					{
						uid: "BIAN-13.0.0-ProductInventoryDistribution",
						name: "Product Inventory Distribution",
					},
				],
			},
		],
	},
	{
		id: 5,
		uid: "BIAN-13.0.0-Operations",
		name: "Operations",
		subDomains: [
			{
				uid: "BIAN-13.0.0-Custody,CollateralAndDocuments",
				name: "Custody, Collateral And Documents",
				services: [
					{
						uid: "BIAN-13.0.0-ArchiveServices",
						name: "Archive Services",
					},
					{
						uid: "BIAN-13.0.0-DocumentDirectory",
						name: "Document Directory",
					},
					{
						uid: "BIAN-13.0.0-DocumentServices",
						name: "Document Services",
					},
					{
						uid: "BIAN-13.0.0-CollateralAllocationManagement",
						name: "Collateral Allocation Management",
					},
					{
						uid: "BIAN-13.0.0-PartyAssetDirectory",
						name: "Party Asset Directory",
					},
					{
						uid: "BIAN-13.0.0-CollateralAssetAdministration",
						name: "Collateral Asset Administration",
					},
					{
						uid: "BIAN-13.0.0-Collections",
						name: "Collections",
					},
					{
						uid: "BIAN-13.0.0-InvestmentAccount",
						name: "Investment Account",
					},
					{
						uid: "BIAN-13.0.0-CustodyAdministration",
						name: "Custody Administration",
					},
					{
						uid: "BIAN-13.0.0-AccountRecovery",
						name: "Account Recovery",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-AccountingServices",
				name: "Accounting Services",
				services: [
					{
						uid: "BIAN-13.0.0-AccountReconciliation",
						name: "Account Reconciliation",
					},
					{
						uid: "BIAN-13.0.0-AccountsReceivable",
						name: "Accounts Receivable",
					},
					{
						uid: "BIAN-13.0.0-FraudDiagnosis",
						name: "Fraud Diagnosis",
					},
					{
						uid: "BIAN-13.0.0-PositionKeeping",
						name: "Position Keeping",
					},
					{
						uid: "BIAN-13.0.0-CustomerPosition",
						name: "Customer Position",
					},
					{
						uid: "BIAN-13.0.0-FraudEvaluation",
						name: "Fraud Evaluation",
					},
					{
						uid: "BIAN-13.0.0-RewardPointsAccount",
						name: "Reward Points Account",
					},
					{
						uid: "BIAN-13.0.0-SecuritiesPositionKeeping",
						name: "Securities Position Keeping",
					},
					{
						uid: "BIAN-13.0.0-CustomerTaxHandling",
						name: "Customer Tax Handling",
					},
					{
						uid: "BIAN-13.0.0-FinancialStatementAssessment",
						name: "Financial Statement Assessment",
					},
					{
						uid: "BIAN-13.0.0-Commissions",
						name: "Commissions",
					},
					{
						uid: "BIAN-13.0.0-FinancialAccounting",
						name: "Financial Accounting",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-ClearingAndSettlement",
				name: "Clearing And Settlement",
				services: [
					{
						uid: "BIAN-13.0.0-TransactionEngine",
						name: "Transaction Engine",
					},
					{
						uid: "BIAN-13.0.0-ACHOperations",
						name: "ACH Operations",
					},
					{
						uid: "BIAN-13.0.0-CardClearing",
						name: "Card Clearing",
					},
					{
						uid: "BIAN-13.0.0-CardeCommerceGateway",
						name: "Card eCommerce Gateway",
					},
					{
						uid: "BIAN-13.0.0-CardFinancialSettlement",
						name: "Card Financial Settlement",
					},
					{
						uid: "BIAN-13.0.0-ChequeProcessing",
						name: "Cheque Processing",
					},
					{
						uid: "BIAN-13.0.0-CorrespondentBankOperations",
						name: "Correspondent Bank Operations",
					},
					{
						uid: "BIAN-13.0.0-PaymentOrder",
						name: "Payment Order",
					},
					{
						uid: "BIAN-13.0.0-PaymentExecution",
						name: "Payment Execution",
					},
					{
						uid: "BIAN-13.0.0-PaymentInstruction",
						name: "Payment Instruction",
					},
					{
						uid: "BIAN-13.0.0-PaymentRailOperations",
						name: "Payment Rail Operations",
					},
					{
						uid: "BIAN-13.0.0-OrderAllocation",
						name: "Order Allocation",
					},
					{
						uid: "BIAN-13.0.0-CorrespondentBankDirectory",
						name: "Correspondent Bank Directory",
					},
					{
						uid: "BIAN-13.0.0-CounterpartyAdministration",
						name: "Counterparty Administration",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-ExternalAgency",
				name: "External Agency",
				services: [
					{
						uid: "BIAN-13.0.0-ContractorandSupplierAgreement",
						name: "Contractor and Supplier Agreement",
					},
					{
						uid: "BIAN-13.0.0-CorrespondentBankRelationshipManagement",
						name: "Correspondent Bank Relationship Management",
					},
					{
						uid: "BIAN-13.0.0-InterbankRelationshipManagement",
						name: "Interbank Relationship Management",
					},
					{
						uid: "BIAN-13.0.0-ProductBrokerAgreement",
						name: "Product Broker Agreement",
					},
					{
						uid: "BIAN-13.0.0-ProductServiceAgency",
						name: "Product Service Agency",
					},
					{
						uid: "BIAN-13.0.0-SyndicateManagement",
						name: "Syndicate Management",
					},
					{
						uid: "BIAN-13.0.0-ServiceProviderOperations",
						name: "Service Provider Operations",
					},
					{
						uid: "BIAN-13.0.0-SubCustodianAgreement",
						name: "Sub Custodian Agreement",
					},
					{
						uid: "BIAN-13.0.0-CommissionAgreement",
						name: "Commission Agreement",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-OperationalServices",
				name: "Operational Services",
				services: [
					{
						uid: "BIAN-13.0.0-ProductCombination",
						name: "Product Combination",
					},
					{
						uid: "BIAN-13.0.0-CardCollections",
						name: "Card Collections",
					},
					{
						uid: "BIAN-13.0.0-CardTransactionSwitch",
						name: "Card Transaction Switch",
					},
					{
						uid: "BIAN-13.0.0-CustomerBilling",
						name: "Customer Billing",
					},
					{
						uid: "BIAN-13.0.0-DelinquentAccountHandling",
						name: "Delinquent Account Handling",
					},
					{
						uid: "BIAN-13.0.0-IssuedDeviceAdministration",
						name: "Issued Device Administration",
					},
					{
						uid: "BIAN-13.0.0-IssuedDeviceTracking",
						name: "Issued Device Tracking",
					},
					{
						uid: "BIAN-13.0.0-Disbursement",
						name: "Disbursement",
					},
					{
						uid: "BIAN-13.0.0-InternalBankAccount",
						name: "Internal Bank Account",
					},
					{
						uid: "BIAN-13.0.0-OpenItemManagement",
						name: "Open Item Management",
					},
					{
						uid: "BIAN-13.0.0-RewardPointsAwardsAndRedemption",
						name: "Reward Points Awards And Redemption",
					},
					{
						uid: "BIAN-13.0.0-TermDepositFrameworkAgreement",
						name: "Term Deposit Framework Agreement",
					},
				],
			},
		],
	},
	{
		id: 6,
		uid: "BIAN-13.0.0-Products",
		name: "Products",
		subDomains: [
			{
				uid: "BIAN-13.0.0-AdvisoryServices",
				name: "Advisory Services",
				services: [
					{
						uid: "BIAN-13.0.0-LegalAdvisory",
						name: "Legal Advisory",
					},
					{
						uid: "BIAN-13.0.0-CorporateFinance",
						name: "Corporate Finance",
					},
					{
						uid: "BIAN-13.0.0-CorporateTaxAdvisory",
						name: "Corporate Tax Advisory",
					},
					{
						uid: "BIAN-13.0.0-ConsumerAdvisoryServices",
						name: "Consumer Advisory Services",
					},
					{
						uid: "BIAN-13.0.0-MergersandAcquisitionsAdvisory",
						name: "Mergers and Acquisitions Advisory",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-CorporateFinance",
				name: "Corporate Finance",
				services: [
					{
						uid: "BIAN-13.0.0-PrivatePlacement",
						name: "Private Placement",
					},
					{
						uid: "BIAN-13.0.0-PublicOffering",
						name: "Public Offering",
					},
					{
						uid: "BIAN-13.0.0-HedgeFundAdministration",
						name: "Hedge Fund Administration",
					},
					{
						uid: "BIAN-13.0.0-MutualFundAdministration",
						name: "Mutual Fund Administration",
					},
					{
						uid: "BIAN-13.0.0-UnitTrustAdministration",
						name: "Unit Trust Administration",
					},
					{
						uid: "BIAN-13.0.0-ECMAndDCM",
						name: "ECM And DCM",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-CorporateBanking",
				name: "Corporate Banking",
				services: [
					{
						uid: "BIAN-13.0.0-CorporateTrustServices",
						name: "Corporate Trust Services",
					},
					{
						uid: "BIAN-13.0.0-CorporateCurrentAccount",
						name: "Corporate Current Account",
					},
					{
						uid: "BIAN-13.0.0-VirtualAccount",
						name: "Virtual Account",
					},
					{
						uid: "BIAN-13.0.0-CashConcentration",
						name: "Cash Concentration",
					},
					{
						uid: "BIAN-13.0.0-CashManagementAndAccountServices",
						name: "Cash Management And Account Services",
					},
					{
						uid: "BIAN-13.0.0-ChequeLockBox",
						name: "Cheque Lock Box",
					},
					{
						uid: "BIAN-13.0.0-CreditFacility",
						name: "Credit Facility",
					},
					{
						uid: "BIAN-13.0.0-DirectDebit",
						name: "Direct Debit",
					},
					{
						uid: "BIAN-13.0.0-CorporatePayrollServices",
						name: "Corporate Payroll Services",
					},
					{
						uid: "BIAN-13.0.0-DirectDebitCollection",
						name: "Direct Debit Collection",
					},
					{
						uid: "BIAN-13.0.0-DirectDebitMandate",
						name: "Direct Debit Mandate",
					},
					{
						uid: "BIAN-13.0.0-DirectDebitsService",
						name: "Direct Debits Service",
					},
					{
						uid: "BIAN-13.0.0-Factoring",
						name: "Factoring",
					},
					{
						uid: "BIAN-13.0.0-NotionalPooling",
						name: "Notional Pooling",
					},
					{
						uid: "BIAN-13.0.0-ProjectFinance",
						name: "Project Finance",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-TradeBanking",
				name: "Trade Banking",
				services: [
					{
						uid: "BIAN-13.0.0-BankDrafts",
						name: "Bank Drafts",
					},
					{
						uid: "BIAN-13.0.0-BankGuarantee",
						name: "Bank Guarantee",
					},
					{
						uid: "BIAN-13.0.0-LetterofCredit",
						name: "Letter of Credit",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-ConsumerBanking",
				name: "Consumer Banking",
				services: [
					{
						uid: "BIAN-13.0.0-BrokeredProduct",
						name: "Brokered Product",
					},
					{
						uid: "BIAN-13.0.0-TrustServices",
						name: "Trust Services",
					},
					{
						uid: "BIAN-13.0.0-CurrencyExchange",
						name: "Currency Exchange",
					},
					{
						uid: "BIAN-13.0.0-CurrentAccount",
						name: "Current Account",
					},
					{
						uid: "BIAN-13.0.0-SalesProduct",
						name: "Sales Product",
					},
					{
						uid: "BIAN-13.0.0-PaymentInitiation",
						name: "Payment Initiation",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-MarketTrading",
				name: "Market Trading",
				services: [
					{
						uid: "BIAN-13.0.0-DealerDesk",
						name: "Dealer Desk",
					},
					{
						uid: "BIAN-13.0.0-MarketMaking",
						name: "Market Making",
					},
					{
						uid: "BIAN-13.0.0-MarketOrder",
						name: "Market Order",
					},
					{
						uid: "BIAN-13.0.0-MarketOrderExecution",
						name: "Market Order Execution",
					},
					{
						uid: "BIAN-13.0.0-SuitabilityChecking",
						name: "Suitability Checking",
					},
					{
						uid: "BIAN-13.0.0-ProgramTrading",
						name: "Program Trading",
					},
					{
						uid: "BIAN-13.0.0-QuoteManagement",
						name: "Quote Management",
					},
					{
						uid: "BIAN-13.0.0-TraderPositionOperations",
						name: "Trader Position Operations",
					},
					{
						uid: "BIAN-13.0.0-StockLendingandRepos",
						name: "Stock Lending and Repos",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-Cards",
				name: "Cards",
				services: [
					{
						uid: "BIAN-13.0.0-CardAuthorization",
						name: "Card Authorization",
					},
					{
						uid: "BIAN-13.0.0-CardNetworkParticipantFacility",
						name: "Card Network Participant Facility",
					},
					{
						uid: "BIAN-13.0.0-CardTransactionCapture",
						name: "Card Transaction Capture",
					},
					{
						uid: "BIAN-13.0.0-CreditCardPositionKeeping",
						name: "Credit Card Position Keeping",
					},
					{
						uid: "BIAN-13.0.0-MerchantAcquiringFacility",
						name: "Merchant Acquiring Facility",
					},
					{
						uid: "BIAN-13.0.0-CreditCard",
						name: "Credit Card",
					},
					{
						uid: "BIAN-13.0.0-MerchantRelations",
						name: "Merchant Relations",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-LoansandDeposits",
				name: "Loans and Deposits",
				services: [
					{
						uid: "BIAN-13.0.0-LeasingItemAdministration",
						name: "Leasing Item Administration",
					},
					{
						uid: "BIAN-13.0.0-ConsumerLoan",
						name: "Consumer Loan",
					},
					{
						uid: "BIAN-13.0.0-CorporateLoan",
						name: "Corporate Loan",
					},
					{
						uid: "BIAN-13.0.0-CorporateLease",
						name: "Corporate Lease",
					},
					{
						uid: "BIAN-13.0.0-FiduciaryAgreement",
						name: "Fiduciary Agreement",
					},
					{
						uid: "BIAN-13.0.0-Loan",
						name: "Loan",
					},
					{
						uid: "BIAN-13.0.0-Leasing",
						name: "Leasing",
					},
					{
						uid: "BIAN-13.0.0-MerchandisingLoan",
						name: "Merchandising Loan",
					},
					{
						uid: "BIAN-13.0.0-MortgageLoan",
						name: "Mortgage Loan",
					},
					{
						uid: "BIAN-13.0.0-TermDeposit",
						name: "Term Deposit",
					},
					{
						uid: "BIAN-13.0.0-StandingOrder",
						name: "Standing Order",
					},
					{
						uid: "BIAN-13.0.0-SavingsAccount",
						name: "Savings Account",
					},
					{
						uid: "BIAN-13.0.0-SyndicatedLoan",
						name: "Syndicated Loan",
					},
					{
						uid: "BIAN-13.0.0-Underwriting",
						name: "Underwriting",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-MarketOperations",
				name: "Market Operations",
				services: [
					{
						uid: "BIAN-13.0.0-CorporateAction",
						name: "Corporate Action",
					},
					{
						uid: "BIAN-13.0.0-FinancialInstrumentValuation",
						name: "Financial Instrument Valuation",
					},
					{
						uid: "BIAN-13.0.0-SecuritiesFailsProcessing",
						name: "Securities Fails Processing",
					},
					{
						uid: "BIAN-13.0.0-TradeandPriceReporting",
						name: "Trade and Price Reporting",
					},
					{
						uid: "BIAN-13.0.0-TradeClearing",
						name: "Trade Clearing",
					},
					{
						uid: "BIAN-13.0.0-TradeConfirmationMatching",
						name: "Trade Confirmation Matching",
					},
					{
						uid: "BIAN-13.0.0-CreditRiskOperations",
						name: "Credit Risk Operations",
					},
					{
						uid: "BIAN-13.0.0-TradingBookOversight",
						name: "Trading Book Oversight",
					},
					{
						uid: "BIAN-13.0.0-TradeSettlement",
						name: "Trade Settlement",
					},
				],
			},
		],
	},
	{
		id: 2,
		uid: "BIAN-13.0.0-FinanceAndRiskManagement",
		name: "Finance And Risk Management",
		subDomains: [
			{
				uid: "BIAN-13.0.0-CreditRisk",
				name: "Credit Risk",
				services: [
					{
						uid: "BIAN-13.0.0-CounterpartyRisk",
						name: "Counterparty Risk",
					},
					{
						uid: "BIAN-13.0.0-CreditManagement",
						name: "Credit Management",
					},
					{
						uid: "BIAN-13.0.0-FraudResolution",
						name: "Fraud Resolution",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-MarketRisk",
				name: "Market Risk",
				services: [
					{
						uid: "BIAN-13.0.0-PositionManagement",
						name: "Position Management",
					},
					{
						uid: "BIAN-13.0.0-LimitandExposureManagement",
						name: "Limit and Exposure Management",
					},
					{
						uid: "BIAN-13.0.0-CreditandMarginManagement",
						name: "Credit and Margin Management",
					},
					{
						uid: "BIAN-13.0.0-EconomicCapital",
						name: "Economic Capital",
					},
					{
						uid: "BIAN-13.0.0-GapAnalysis",
						name: "Gap Analysis",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-OperationalRisk",
				name: "Operational Risk",
				services: [
					{
						uid: "BIAN-13.0.0-BusinessRiskModels",
						name: "Business Risk Models",
					},
					{
						uid: "BIAN-13.0.0-OperationalRiskModels",
						name: "Operational Risk Models",
					},
					{
						uid: "BIAN-13.0.0-ProductionRiskModels",
						name: "Production Risk Models",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-Compliance",
				name: "Compliance",
				services: [
					{
						uid: "BIAN-13.0.0-RegulatoryAndLegalAuthority",
						name: "Regulatory And Legal Authority",
					},
					{
						uid: "BIAN-13.0.0-ComplianceReporting",
						name: "Compliance Reporting",
					},
					{
						uid: "BIAN-13.0.0-GuidelineCompliance",
						name: "Guideline Compliance",
					},
					{
						uid: "BIAN-13.0.0-RegulatoryCompliance",
						name: "Regulatory Compliance",
					},
					{
						uid: "BIAN-13.0.0-RegulatoryReporting",
						name: "Regulatory Reporting",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-GroupTreasury",
				name: "Group Treasury",
				services: [
					{
						uid: "BIAN-13.0.0-AssetSecuritization",
						name: "Asset Securitization",
					},
					{
						uid: "BIAN-13.0.0-BankPortfolioAdministration",
						name: "Bank Portfolio Administration",
					},
					{
						uid: "BIAN-13.0.0-BankPortfolioAnalysis",
						name: "Bank Portfolio Analysis",
					},
					{
						uid: "BIAN-13.0.0-CorporateTreasuryAnalysis",
						name: "Corporate Treasury Analysis",
					},
					{
						uid: "BIAN-13.0.0-CorporateTreasury",
						name: "Corporate Treasury",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-FinancialControl",
				name: "Financial Control",
				services: [
					{
						uid: "BIAN-13.0.0-EnterpriseTaxAdministration",
						name: "Enterprise Tax Administration",
					},
					{
						uid: "BIAN-13.0.0-FinancialCompliance",
						name: "Financial Compliance",
					},
					{
						uid: "BIAN-13.0.0-FinancialControl",
						name: "Financial Control",
					},
					{
						uid: "BIAN-13.0.0-FinancialStatements",
						name: "Financial Statements",
					},
					{
						uid: "BIAN-13.0.0-ApprovedSupplierDirectory",
						name: "Approved Supplier Directory",
					},
					{
						uid: "BIAN-13.0.0-CompanyBillingandPayments",
						name: "Company Billing and Payments",
					},
				],
			},
		],
	},
	{
		id: 4,
		uid: "BIAN-13.0.0-ResourceManagement",
		name: "Resource Management",
		subDomains: [
			{
				uid: "BIAN-13.0.0-PlatformOperations",
				name: "Platform Operations",
				services: [
					{
						uid: "BIAN-13.0.0-SystemDeployment",
						name: "System Deployment",
					},
					{
						uid: "BIAN-13.0.0-InternalNetworkOperation",
						name: "Internal Network Operation",
					},
					{
						uid: "BIAN-13.0.0-OperationalGateway",
						name: "Operational Gateway",
					},
					{
						uid: "BIAN-13.0.0-PlatformOperations",
						name: "Platform Operations",
					},
					{
						uid: "BIAN-13.0.0-SystemsHelpDesk",
						name: "Systems Help Desk",
					},
					{
						uid: "BIAN-13.0.0-SystemsAssurance",
						name: "Systems Assurance",
					},
					{
						uid: "BIAN-13.0.0-SystemsOperations",
						name: "Systems Operations",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-HumanResources",
				name: "Human Resources",
				services: [
					{
						uid: "BIAN-13.0.0-EmployeeandContractorContract",
						name: "Employee and Contractor Contract",
					},
					{
						uid: "BIAN-13.0.0-EmployeeBenefits",
						name: "Employee Benefits",
					},
					{
						uid: "BIAN-13.0.0-EmployeeCertification",
						name: "Employee Certification",
					},
					{
						uid: "BIAN-13.0.0-EmployeeDataManagement",
						name: "Employee Data Management",
					},
					{
						uid: "BIAN-13.0.0-EmployeeAssignment",
						name: "Employee Assignment",
					},
					{
						uid: "BIAN-13.0.0-EmployeeAccess",
						name: "Employee Access",
					},
					{
						uid: "BIAN-13.0.0-EmployeeEvaluation",
						name: "Employee Evaluation",
					},
					{
						uid: "BIAN-13.0.0-EmployeePayrollAndIncentives",
						name: "Employee Payroll And Incentives",
					},
					{
						uid: "BIAN-13.0.0-Recruitment",
						name: "Recruitment",
					},
					{
						uid: "BIAN-13.0.0-TravelandExpenses",
						name: "Travel and Expenses",
					},
					{
						uid: "BIAN-13.0.0-WorkforceTraining",
						name: "Workforce Training",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-BuildingsAndEquipment",
				name: "Buildings And Equipment",
				services: [
					{
						uid: "BIAN-13.0.0-BuildingMaintenance",
						name: "Building Maintenance",
					},
					{
						uid: "BIAN-13.0.0-EquipmentAdministration",
						name: "Equipment Administration",
					},
					{
						uid: "BIAN-13.0.0-SiteOperations",
						name: "Site Operations",
					},
					{
						uid: "BIAN-13.0.0-EquipmentMaintenance",
						name: "Equipment Maintenance",
					},
					{
						uid: "BIAN-13.0.0-UtilitiesAdministration",
						name: "Utilities Administration",
					},
					{
						uid: "BIAN-13.0.0-SiteAdministration",
						name: "Site Administration",
					},
					{
						uid: "BIAN-13.0.0-FixedAssetRegister",
						name: "Fixed Asset Register",
					},
					{
						uid: "BIAN-13.0.0-Procurement",
						name: "Procurement",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-UnitManagement",
				name: "Unit Management",
				services: [
					{
						uid: "BIAN-13.0.0-BusinessUnitDirection",
						name: "Business Unit Direction",
					},
					{
						uid: "BIAN-13.0.0-BusinessUnitAccounting",
						name: "Business Unit Accounting",
					},
					{
						uid: "BIAN-13.0.0-BusinessUnitFinancialAnalysis",
						name: "Business Unit Financial Analysis",
					},
					{
						uid: "BIAN-13.0.0-BusinessUnitManagement",
						name: "Business Unit Management",
					},
					{
						uid: "BIAN-13.0.0-BusinessUnitFinancialOperations",
						name: "Business Unit Financial Operations",
					},
				],
			},
		],
	},
	{
		id: 8,
		uid: "BIAN-13.0.0-BusinessDevelopment",
		name: "Business Development",
		subDomains: [
			{
				uid: "BIAN-13.0.0-IntelectualPropertyAndKnowledge",
				name: "Intelectual Property And Knowledge",
				services: [
					{
						uid: "BIAN-13.0.0-EnterpriseArchitecture",
						name: "Enterprise Architecture",
					},
					{
						uid: "BIAN-13.0.0-IntellectualPropertyPortfolio",
						name: "Intellectual Property Portfolio",
					},
					{
						uid: "BIAN-13.0.0-ManagementManual",
						name: "Management Manual",
					},
					{
						uid: "BIAN-13.0.0-KnowledgeExchange",
						name: "Knowledge Exchange",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-ProductManagement",
				name: "Product Management",
				services: [
					{
						uid: "BIAN-13.0.0-ProductionRelease",
						name: "Production Release",
					},
					{
						uid: "BIAN-13.0.0-DiscountPricing",
						name: "Discount Pricing",
					},
					{
						uid: "BIAN-13.0.0-ProductDirectory",
						name: "Product Directory",
					},
					{
						uid: "BIAN-13.0.0-ProductQualityAssurance",
						name: "Product Quality Assurance",
					},
					{
						uid: "BIAN-13.0.0-ProductTraining",
						name: "Product Training",
					},
					{
						uid: "BIAN-13.0.0-ProductDeployment",
						name: "Product Deployment",
					},
					{
						uid: "BIAN-13.0.0-ProductDesign",
						name: "Product Design",
					},
					{
						uid: "BIAN-13.0.0-ProductPortfolio",
						name: "Product Portfolio",
					},
					{
						uid: "BIAN-13.0.0-CaseRootCauseAnalysis",
						name: "Case Root Cause Analysis",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-SolutionDevelopment",
				name: "Solution Development",
				services: [
					{
						uid: "BIAN-13.0.0-ITStandardsAndGuidelines",
						name: "IT Standards And Guidelines",
					},
					{
						uid: "BIAN-13.0.0-DevelopmentEnvironment",
						name: "Development Environment",
					},
					{
						uid: "BIAN-13.0.0-SystemDevelopment",
						name: "System Development",
					},
					{
						uid: "BIAN-13.0.0-SystemsAdministration",
						name: "Systems Administration",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-MarketingAndDevelopment",
				name: "Marketing And Development",
				services: [
					{
						uid: "BIAN-13.0.0-CompetitorAnalysis",
						name: "Competitor Analysis",
					},
					{
						uid: "BIAN-13.0.0-ContributionAnalysis",
						name: "Contribution Analysis",
					},
					{
						uid: "BIAN-13.0.0-CustomerPortfolio",
						name: "Customer Portfolio",
					},
					{
						uid: "BIAN-13.0.0-MarketAnalysis",
						name: "Market Analysis",
					},
					{
						uid: "BIAN-13.0.0-MarketResearch",
						name: "Market Research",
					},
					{
						uid: "BIAN-13.0.0-SegmentDirection",
						name: "Segment Direction",
					},
					{
						uid: "BIAN-13.0.0-Advertising",
						name: "Advertising",
					},
					{
						uid: "BIAN-13.0.0-CustomerCampaignDesign",
						name: "Customer Campaign Design",
					},
					{
						uid: "BIAN-13.0.0-BusinessDevelopment",
						name: "Business Development",
					},
					{
						uid: "BIAN-13.0.0-BrandManagement",
						name: "Brand Management",
					},
					{
						uid: "BIAN-13.0.0-CustomerSurveys",
						name: "Customer Surveys",
					},
					{
						uid: "BIAN-13.0.0-CustomerCampaignManagement",
						name: "Customer Campaign Management",
					},
					{
						uid: "BIAN-13.0.0-PromotionalEvents",
						name: "Promotional Events",
					},
					{
						uid: "BIAN-13.0.0-ProspectCampaignDesign",
						name: "Prospect Campaign Design",
					},
					{
						uid: "BIAN-13.0.0-SalesPlanning",
						name: "Sales Planning",
					},
					{
						uid: "BIAN-13.0.0-ProspectCampaignManagement",
						name: "Prospect Campaign Management",
					},
				],
			},
			{
				uid: "BIAN-13.0.0-ModelsAndAnalytics",
				name: "Models And Analytics",
				services: [
					{
						uid: "BIAN-13.0.0-TradingModels",
						name: "Trading Models",
					},
					{
						uid: "BIAN-13.0.0-QuantModel",
						name: "Quant Model",
					},
					{
						uid: "BIAN-13.0.0-ContributionModels",
						name: "Contribution Models",
					},
					{
						uid: "BIAN-13.0.0-CreditRiskModels",
						name: "Credit Risk Models",
					},
					{
						uid: "BIAN-13.0.0-CustomerBehaviorModels",
						name: "Customer Behavior Models",
					},
					{
						uid: "BIAN-13.0.0-FinancialInstrumentValuationModels",
						name: "Financial Instrument Valuation Models",
					},
					{
						uid: "BIAN-13.0.0-FraudModel",
						name: "Fraud Model",
					},
					{
						uid: "BIAN-13.0.0-MarketRiskModels",
						name: "Market Risk Models",
					},
					{
						uid: "BIAN-13.0.0-LiquidityRiskModels",
						name: "Liquidity Risk Models",
					},
				],
			},
		],
	},
];
