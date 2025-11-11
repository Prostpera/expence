export enum ConversationalScenarioDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface ConversationMessage {
  id: string;
  speaker: 'case' | 'user';
  text: string;
  timestamp: Date;
}

export interface ConversationChoice {
  id: string;
  text: string;
  nextNodeId: string;
  isOptimal?: boolean;
}

export interface ConversationNode {
  id: string;
  caseMessage: string;
  choices: ConversationChoice[];
  learningPoint?: string; // Key concept being taught
  isEndNode?: boolean;
  successFeedback?: string;
  improvementFeedback?: string;
}

export interface ConversationalScenario {
  id: string;
  title: string;
  difficulty: ConversationalScenarioDifficulty;
  description: string;
  summary: string; // Brief overview shown before starting
  characterName: string; // The person they're helping (Alex, Jordan, Sam)
  characterAvatar: string;
  totalLearningPoints: number;
  expReward: number;
  coinReward: number;
  startNodeId: string;
  nodes: ConversationNode[];
  learningObjectives: string[]; // What they'll learn
}

// Conversational scenarios
export const CONVERSATIONAL_SCENARIOS: ConversationalScenario[] = [
  {
    id: 'conv_emergency_fund',
    title: 'Help Alex Build Financial Security',
    difficulty: ConversationalScenarioDifficulty.EASY,
    description: 'Guide a new graduate through building their first emergency fund',
    summary: "Meet Alex, a recent college graduate who just landed their first job earning $2,000/month after taxes. They're excited but completely new to managing money. Alex has heard about emergency funds but doesn't know where to start. Your job is to guide them through building a solid financial foundation.",
    characterName: 'Alex',
    characterAvatar: '/alex-avatar.png',
    totalLearningPoints: 5,
    expReward: 100,
    coinReward: 50,
    startNodeId: 'start',
    learningObjectives: [
      'Understanding emergency fund importance',
      'Determining the right emergency fund size',
      'Creating a realistic savings plan',
      'Learning when to use emergency funds',
      'Building financial discipline'
    ],
    nodes: [
      {
        id: 'start',
        caseMessage: "Hey there! I'm Case, your AI financial advisor. I'd like you to meet Alex - they just graduated and started their first real job! Alex makes $2,000 a month after taxes and spends about $1,500 on rent, food, and basics. They have $500 left over each month and no idea what to do with it. How should we help Alex get started?",
        choices: [
          {
            id: 'emergency_first',
            text: "Let's talk about building an emergency fund first",
            nextNodeId: 'emergency_explanation',
            isOptimal: true
          },
          {
            id: 'investment_first',
            text: "They should start investing that $500 right away",
            nextNodeId: 'investment_too_early'
          },
          {
            id: 'spend_it',
            text: "They earned it! Tell them to enjoy the extra money",
            nextNodeId: 'spending_reality_check'
          }
        ],
        learningPoint: 'Financial Priorities'
      },
      {
        id: 'emergency_explanation',
        caseMessage: "Excellent choice! Alex is curious: 'What exactly is an emergency fund and why do I need one when I have a steady job?' This is a great question - many people think having a job means they're financially secure. How would you explain this to Alex?",
        choices: [
          {
            id: 'job_security',
            text: "Jobs can be unpredictable - what if you get sick, have car trouble, or face unexpected costs?",
            nextNodeId: 'emergency_examples',
            isOptimal: true
          },
          {
            id: 'save_everything',
            text: "You should save every penny because you never know what might happen",
            nextNodeId: 'balance_explanation'
          },
          {
            id: 'credit_cards',
            text: "You can always use credit cards for emergencies",
            nextNodeId: 'credit_card_problem'
          }
        ],
        learningPoint: 'Emergency Fund Purpose'
      },
      {
        id: 'emergency_examples',
        caseMessage: "Perfect explanation! Alex nods: 'That makes sense. Last month my friend's car needed a $800 repair and they had to put it on a credit card.' Alex is convinced but asks: 'How much should I save? I've heard different numbers.' Their monthly expenses are $1,500. What do you recommend?",
        choices: [
          {
            id: 'three_to_six',
            text: "Aim for 3-6 months of expenses - so $4,500 to $9,000 for you",
            nextNodeId: 'realistic_timeline',
            isOptimal: true
          },
          {
            id: 'one_month',
            text: "Start with just one month ($1,500) - that's more manageable",
            nextNodeId: 'too_little_explanation'
          },
          {
            id: 'twelve_months',
            text: "You should have a full year saved - $18,000 to be really safe",
            nextNodeId: 'too_much_explanation'
          }
        ],
        learningPoint: 'Emergency Fund Size'
      },
      {
        id: 'realistic_timeline',
        caseMessage: "Great advice! Alex looks a bit overwhelmed: 'That's a lot of money... at $100 per month, it'll take me 45-90 months to save that much!' How can we help Alex create a realistic plan?",
        choices: [
          {
            id: 'start_small',
            text: "Start with a smaller goal - maybe $1,000 first, then build from there",
            nextNodeId: 'progress_motivation',
            isOptimal: true
          },
          {
            id: 'save_more',
            text: "You should save $400 per month instead - you have $500 extra anyway",
            nextNodeId: 'sustainability_issue'
          },
          {
            id: 'dont_worry',
            text: "Don't worry about the timeline, just save what you can when you can",
            nextNodeId: 'consistency_importance'
          }
        ],
        learningPoint: 'Realistic Goal Setting'
      },
      {
        id: 'progress_motivation',
        caseMessage: "Excellent strategy! Alex smiles: 'That feels much more doable!' They set up an automatic transfer of $100/month. Three months later, Alex has $300 saved. Then their car breaks down and needs a $250 repair. Alex texts you: 'Should I use my emergency fund or put it on my credit card to keep saving?' What's your advice?",
        choices: [
          {
            id: 'use_fund',
            text: "Use the emergency fund - this is exactly what it's for!",
            nextNodeId: 'fund_purpose_confirmed',
            isOptimal: true
          },
          {
            id: 'credit_card',
            text: "Use the credit card to preserve your savings progress",
            nextNodeId: 'interest_cost_lesson'
          },
          {
            id: 'ask_family',
            text: "Maybe ask family for help to avoid touching your savings",
            nextNodeId: 'independence_lesson'
          }
        ],
        learningPoint: 'Using Emergency Funds'
      },
      {
        id: 'fund_purpose_confirmed',
        caseMessage: "Perfect! Alex uses $250 from the fund and feels great about the decision. Six months later, Alex has rebuilt to $650 saved. A friend invites them on a last-minute vacation for $400. Alex asks: 'This is a once-in-a-lifetime opportunity - should I use my emergency fund?' How do you respond?",
        choices: [
          {
            id: 'not_emergency',
            text: "That's not an emergency - save separately for fun activities",
            nextNodeId: 'discipline_success',
            isOptimal: true
          },
          {
            id: 'compromise',
            text: "Use half ($200) - you need to live a little too",
            nextNodeId: 'boundary_lesson'
          },
          {
            id: 'go_for_it',
            text: "Life is short - use the fund and rebuild it later",
            nextNodeId: 'discipline_importance'
          }
        ],
        learningPoint: 'Financial Discipline'
      },
      {
        id: 'discipline_success',
        caseMessage: "Fantastic! Alex decides to skip the trip and instead starts a separate 'fun fund' with $50/month. A year later, Alex has a fully funded $6,000 emergency fund and has taken two great vacations with money they saved specifically for fun. Alex thanks you: 'I feel so much more confident about money now!' Congratulations - you've helped Alex build a solid financial foundation!",
        choices: [],
        isEndNode: true,
        successFeedback: "You guided Alex perfectly through building financial discipline and security. They now understand the difference between needs and wants, and have created sustainable saving habits.",
        learningPoint: 'Financial Success'
      },
      // Error paths with learning opportunities
      {
        id: 'investment_too_early',
        caseMessage: "Alex is excited about investing but asks: 'What if I need that money in an emergency?' Without an emergency fund, Alex might have to sell investments at a loss during market downturns. What would you tell them?",
        choices: [
          {
            id: 'emergency_first_correction',
            text: "You're right - let's build an emergency fund first, then invest",
            nextNodeId: 'emergency_explanation'
          }
        ]
      },
      {
        id: 'spending_reality_check',
        caseMessage: "Alex tries this for a few months, spending the extra $500 on dining out and shopping. Then their laptop breaks (needed for work) and they panic: 'I don't have money for a replacement!' They realize they need a different approach. What should they do now?",
        choices: [
          {
            id: 'learn_from_mistake',
            text: "This is a perfect example of why we need emergency funds",
            nextNodeId: 'emergency_explanation'
          }
        ]
      }
      // ... more nodes for other paths
    ]
  },
  {
    id: 'conv_credit_card',
    title: 'Help Jordan Escape Debt',
    difficulty: ConversationalScenarioDifficulty.MEDIUM,
    description: 'Guide someone through paying off credit card debt strategically',
    summary: "Meet Jordan, who has gotten into credit card trouble. They have $3,000 spread across two cards - Card A has $2,000 at 22% APR, Card B has $1,000 at 18% APR. Jordan can afford to pay $300/month total toward these debts but doesn't know the best approach. Help them create a debt payoff strategy.",
    characterName: 'Jordan',
    characterAvatar: '/jordan-avatar.png',
    totalLearningPoints: 5,
    expReward: 150,
    coinReward: 75,
    startNodeId: 'cc_start',
    learningObjectives: [
      'Understanding debt avalanche vs snowball methods',
      'Managing reduced income situations', 
      'Using balance transfers strategically',
      'Avoiding new debt during payoff',
      'Building long-term credit health'
    ],
    nodes: [
      {
        id: 'cc_start',
        caseMessage: "Hi again! I've got someone who needs our help with a common but serious problem. Meet Jordan - they're dealing with credit card debt and feeling overwhelmed. Jordan owes $3,000 total: $2,000 on Card A (22% APR) and $1,000 on Card B (18% APR). They can pay $300/month toward these debts. What's our first move?",
        choices: [
          {
            id: 'avalanche_method',
            text: "Focus extra payments on Card A since it has the higher interest rate",
            nextNodeId: 'avalanche_explanation',
            isOptimal: true
          },
          {
            id: 'snowball_method', 
            text: "Pay off Card B first since it has the smaller balance",
            nextNodeId: 'snowball_discussion'
          },
          {
            id: 'equal_payments',
            text: "Split the $300 equally between both cards",
            nextNodeId: 'equal_payment_issue'
          }
        ],
        learningPoint: 'Debt Payoff Strategy'
      },
      {
        id: 'avalanche_explanation',
        caseMessage: "Excellent! You've chosen the debt avalanche method - mathematically the best approach. Jordan asks: 'How exactly should I split my $300 payment?' Both cards have $25 minimum payments. How do we structure this?",
        choices: [
          {
            id: 'minimums_plus_extra',
            text: "Pay $25 minimum on each card, then put the remaining $250 toward Card A",
            nextNodeId: 'income_reduction_crisis',
            isOptimal: true
          },
          {
            id: 'skip_minimums',
            text: "Put the full $300 toward Card A to pay it off faster",
            nextNodeId: 'minimum_payment_lesson'
          }
        ],
        learningPoint: 'Payment Structure'
      },
      {
        id: 'income_reduction_crisis',
        caseMessage: "Perfect strategy! Jordan starts this plan and makes great progress for 3 months. Card A is down to $1,200. Then disaster strikes - Jordan's work hours get cut and they can only afford $150/month total now. What should we advise?",
        choices: [
          {
            id: 'maintain_minimums',
            text: "Pay the $50 in minimums first, then put $100 toward Card A",
            nextNodeId: 'balance_transfer_opportunity',
            isOptimal: true
          },
          {
            id: 'stop_payments',
            text: "Contact the credit card companies to explain the situation",
            nextNodeId: 'payment_importance'
          }
        ],
        learningPoint: 'Crisis Management'
      },
      {
        id: 'balance_transfer_opportunity',
        caseMessage: "Smart thinking! Jordan maintains minimum payments and their credit stays intact. After 2 months of reduced payments, they get a pre-approved balance transfer offer: 0% APR for 12 months with a 3% transfer fee. Their remaining debt is about $2,100. Should they take it?",
        choices: [
          {
            id: 'take_transfer',
            text: "Yes! The 3% fee ($63) is much less than 12 months of interest charges",
            nextNodeId: 'discipline_test',
            isOptimal: true
          },
          {
            id: 'avoid_new_credit',
            text: "No, opening new credit accounts is always risky",
            nextNodeId: 'transfer_benefits_explained'
          }
        ],
        learningPoint: 'Strategic Balance Transfers'
      },
      {
        id: 'discipline_test',
        caseMessage: "Excellent analysis! Jordan transfers the debt and now has $2,163 at 0% APR. Their income returns to normal and they're paying $300/month again. After 7 months, they have just $63 left to pay off. Then Jordan sees a huge sale on something they've wanted for months. What's your advice?",
        choices: [
          {
            id: 'finish_debt_first',
            text: "Finish paying off the debt completely before any purchases",
            nextNodeId: 'debt_freedom_success',
            isOptimal: true
          },
          {
            id: 'small_purchase_ok',
            text: "A small purchase is okay since they're so close to being debt-free",
            nextNodeId: 'discipline_importance'
          }
        ],
        learningPoint: 'Financial Discipline'
      },
      {
        id: 'debt_freedom_success',
        caseMessage: "Perfect! Jordan resists the temptation and pays off the final $63. They're now completely debt-free and have learned incredible discipline. Jordan asks: 'I have three credit cards now - the original two plus the balance transfer card, all at zero balance. What should I do with them?' What do you recommend?",
        choices: [
          {
            id: 'keep_oldest_card',
            text: "Keep the oldest card open, close the newer ones to avoid temptation",
            nextNodeId: 'credit_health_success',
            isOptimal: true
          },
          {
            id: 'keep_all_cards',
            text: "Keep all cards open for better credit utilization ratio",
            nextNodeId: 'temptation_warning'
          }
        ],
        learningPoint: 'Credit Management'
      },
      {
        id: 'credit_health_success',
        caseMessage: "Brilliant advice! Jordan keeps their oldest card (for credit history length) and closes the others. Six months later, Jordan has built an emergency fund and hasn't used credit cards at all. They thank you: 'I never thought I'd be debt-free AND have savings!' You've successfully guided Jordan from debt crisis to financial stability!",
        choices: [],
        isEndNode: true,
        successFeedback: "You expertly guided Jordan through debt elimination using the mathematically optimal avalanche method while maintaining flexibility during tough times.",
        learningPoint: 'Financial Success'
      }
    ]
  },
  {
    id: 'conv_investment',
    title: 'Help Sam Start Investing',
    difficulty: ConversationalScenarioDifficulty.HARD,
    description: 'Guide someone through complex investment decisions and portfolio building',
    summary: "Meet Sam, 28 years old, making $65,000/year. They have $15,000 saved: $6,000 emergency fund (4 months expenses), $9,000 ready to invest. Sam's employer offers 401(k) matching up to 5% of salary, but Sam currently only contributes 3%. Help Sam make smart investment decisions in a complex financial landscape.",
    characterName: 'Sam',
    characterAvatar: '/sam-avatar.png', 
    totalLearningPoints: 5,
    expReward: 200,
    coinReward: 100,
    startNodeId: 'inv_start',
    learningObjectives: [
      'Maximizing employer 401(k) matching',
      'Understanding risk vs. speculation',
      'Managing market volatility emotions',
      'Investment account priority ladder',
      'Avoiding high-fee investment products'
    ],
    nodes: [
      {
        id: 'inv_start',
        caseMessage: "Welcome to our most advanced scenario! Meet Sam - they're 28, earn $65k annually, and have done great building their foundation. Sam has a 4-month emergency fund ($6,000) and $9,000 ready to invest. Here's the key detail: Sam's employer matches 401(k) contributions up to 5% of salary, but Sam only contributes 3% currently. What should be our first priority?",
        choices: [
          {
            id: 'max_employer_match',
            text: "Increase 401(k) to 5% immediately to get the full employer match",
            nextNodeId: 'investment_options_discussion',
            isOptimal: true
          },
          {
            id: 'invest_9k_first',
            text: "Invest the $9,000 in index funds right away",
            nextNodeId: 'free_money_lesson'
          },
          {
            id: 'bigger_emergency_fund',
            text: "Build the emergency fund to 6 months first",
            nextNodeId: 'priority_explanation'
          }
        ],
        learningPoint: 'Investment Priorities'
      },
      {
        id: 'investment_options_discussion',
        caseMessage: "Perfect! Sam increases their 401(k) to 5% (costs $135/month more, gets $135/month match - free money!). Now about that $9,000 to invest. Sam's friend made 40% day-trading crypto and says 'You should try it!' Another friend suggests boring old S&P 500 index funds. What's your guidance?",
        choices: [
          {
            id: 'index_funds_steady',
            text: "Go with low-cost S&P 500 index funds for long-term growth",
            nextNodeId: 'market_crash_test',
            isOptimal: true
          },
          {
            id: 'crypto_diversification',
            text: "Put some in crypto for higher returns, some in index funds to diversify",
            nextNodeId: 'speculation_vs_investing'
          },
          {
            id: 'wait_for_crash',
            text: "Wait for the market to crash, then buy stocks cheaper",
            nextNodeId: 'timing_market_lesson'
          }
        ],
        learningPoint: 'Investment Strategy'
      },
      {
        id: 'market_crash_test',
        caseMessage: "Wise choice! Sam invests the $9,000 in a low-cost S&P 500 index fund. Six months later, the market drops 15% and Sam's investment is worth $7,650 (down $1,350). Sam is panicking and calls you: 'I've lost over $1,000! Should I sell before it gets worse?' Meanwhile, their crypto friend is down 60%. What do you tell Sam?",
        choices: [
          {
            id: 'stay_the_course',
            text: "This is normal market volatility. Keep investing monthly through your 401(k)",
            nextNodeId: 'market_recovery',
            isOptimal: true
          },
          {
            id: 'sell_and_wait',
            text: "Sell now to preserve what's left, wait for markets to stabilize",
            nextNodeId: 'panic_selling_lesson'
          },
          {
            id: 'buy_more_dip',
            text: "This is a great opportunity to invest more money at lower prices",
            nextNodeId: 'dollar_cost_averaging'
          }
        ],
        learningPoint: 'Market Volatility Management'
      },
      {
        id: 'market_recovery',
        caseMessage: "You helped Sam stay calm during the storm! Eighteen months later, markets have recovered and grown. Sam's original $9,000 is now worth $10,800, plus they've been contributing $270/month to their 401(k) ($135 + $135 match). Sam's friend mentions Roth IRAs. With Sam's current savings rate, what should they consider?",
        choices: [
          {
            id: 'roth_after_match',
            text: "After maxing employer match, Roth IRA is the next priority",
            nextNodeId: 'fee_trap_scenario',
            isOptimal: true
          },
          {
            id: 'max_roth_immediately',
            text: "Contribute the full $6,500 annual max to Roth IRA immediately",
            nextNodeId: 'affordability_check'
          },
          {
            id: 'only_401k',
            text: "Just focus on increasing 401(k) contributions instead",
            nextNodeId: 'tax_diversification_benefit'
          }
        ],
        learningPoint: 'Retirement Account Strategy'
      },
      {
        id: 'fee_trap_scenario',
        caseMessage: "Excellent prioritization! Sam is now 30, has $28,000 invested, and just got a $10,000 raise. A financial advisor approaches Sam saying: 'I can manage your portfolio for just 1% annually - that's only $280 per year now, and I'll help you pick the best funds!' Should Sam hire this advisor?",
        choices: [
          {
            id: 'avoid_high_fees',
            text: "No - that 1% fee compounds to huge losses over decades",
            nextNodeId: 'investment_success',
            isOptimal: true
          },
          {
            id: 'professional_help',
            text: "Yes - professional management is worth 1% for better returns",
            nextNodeId: 'fee_impact_lesson'
          },
          {
            id: 'negotiate_fee',
            text: "Try to negotiate the fee down to 0.5%",
            nextNodeId: 'diy_vs_advisor'
          }
        ],
        learningPoint: 'Investment Fee Management'
      },
      {
        id: 'investment_success',
        caseMessage: "Outstanding! You saved Sam from a fee trap that could have cost over $100,000 by retirement. Sam continues with low-cost index funds and steady contributions. At 32, Sam has $45,000 invested and is on track to be a millionaire by retirement. Sam says: 'I can't believe how simple successful investing actually is - just consistent contributions to low-cost funds!' You've given Sam the knowledge for lifelong investment success!",
        choices: [],
        isEndNode: true,
        successFeedback: "You masterfully guided Sam through complex investment decisions, helping them avoid speculation, manage emotions, and dodge fee traps.",
        learningPoint: 'Investment Mastery'
      }
    ]
  }
];