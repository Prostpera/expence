export enum ScenarioDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface ScenarioQuestion {
  id: string;
  questionNumber: number;
  situation: string;
  question: string;
  options: ScenarioOption[];
  correctFeedback: string;
  incorrectFeedback: string;
}

export interface LearningScenario {
  id: string;
  title: string;
  difficulty: ScenarioDifficulty;
  description: string;
  totalQuestions: number;
  expReward: number;
  coinReward: number;
  questions: ScenarioQuestion[];
}

// Preset scenarios
export const LEARNING_SCENARIOS: LearningScenario[] = [
  {
    id: 'easy_emergency_fund',
    title: 'Emergency Fund Basics',
    difficulty: ScenarioDifficulty.EASY,
    description: 'Learn the fundamentals of building an emergency fund',
    totalQuestions: 5,
    expReward: 100,
    coinReward: 50,
    questions: [
      {
        id: 'ef_q1',
        questionNumber: 1,
        situation: "Hey there! I'm Case, your financial advisor. Welcome to your first learning quest! Let me tell you about my friend Alex. Alex just got their first job and earns $2,000 a month after taxes. They're excited but don't know where to start with saving.",
        question: "What should Alex's FIRST financial priority be?",
        options: [
          {
            id: 'ef_q1_a',
            text: 'Save for a vacation',
            isCorrect: false,
            feedback: "While vacations are fun, there's something more important first..."
          },
          {
            id: 'ef_q1_b',
            text: 'Start building an emergency fund',
            isCorrect: true,
            feedback: "Excellent! An emergency fund is the foundation of financial security."
          },
          {
            id: 'ef_q1_c',
            text: 'Buy a new car',
            isCorrect: false,
            feedback: "That's a big purchase! Let's secure the basics first."
          }
        ],
        correctFeedback: "That's right! An emergency fund protects you from unexpected expenses.",
        incorrectFeedback: "Not quite. The foundation of financial health is an emergency fund."
      },
      {
        id: 'ef_q2',
        questionNumber: 2,
        situation: "Great thinking! Alex decides to build an emergency fund. They're wondering how much they should save. Their monthly expenses are about $1,500 for rent, food, utilities, and transportation.",
        question: "How many months of expenses should Alex aim to save in their emergency fund?",
        options: [
          {
            id: 'ef_q2_a',
            text: '1 month',
            isCorrect: false,
            feedback: "That's a start, but experts recommend more than that."
          },
          {
            id: 'ef_q2_b',
            text: '3-6 months',
            isCorrect: true,
            feedback: "Perfect! This is the recommended safety net for most people."
          },
          {
            id: 'ef_q2_c',
            text: '12 months',
            isCorrect: false,
            feedback: "That's ambitious! While good, 3-6 months is the typical recommendation."
          }
        ],
        correctFeedback: "Exactly! 3-6 months covers most emergencies without being overwhelming.",
        incorrectFeedback: "The standard recommendation is 3-6 months of expenses."
      },
      {
        id: 'ef_q3',
        questionNumber: 3,
        situation: "Alex is motivated! With $1,500 in monthly expenses, they need to save between $4,500-$9,000. That seems like a lot. Alex earns $2,000/month and spends $1,500.",
        question: "How much can Alex realistically save each month toward their emergency fund?",
        options: [
          {
            id: 'ef_q3_a',
            text: '$100 (20% of remaining income)',
            isCorrect: true,
            feedback: "Smart! Starting small and consistent is better than overcommitting."
          },
          {
            id: 'ef_q3_b',
            text: '$500 (100% of remaining income)',
            isCorrect: false,
            feedback: "That leaves nothing for unexpected costs or any enjoyment!"
          },
          {
            id: 'ef_q3_c',
            text: '$0 - Save only if there is money left over',
            isCorrect: false,
            feedback: "This rarely works. Pay yourself first!"
          }
        ],
        correctFeedback: "Great choice! Consistent saving beats sporadic large deposits.",
        incorrectFeedback: "Saving too much or too little can both derail your progress."
      },
      {
        id: 'ef_q4',
        questionNumber: 4,
        situation: "Excellent! Alex sets up automatic transfers of $100 to savings each month. After 3 months, they've saved $300. Then their car breaks down and the repair costs $250.",
        question: "What should Alex do?",
        options: [
          {
            id: 'ef_q4_a',
            text: 'Use the emergency fund for the repair',
            isCorrect: true,
            feedback: "Exactly! This is what emergency funds are for."
          },
          {
            id: 'ef_q4_b',
            text: 'Put it on a credit card to preserve savings',
            isCorrect: false,
            feedback: "That would mean paying interest when you have the cash available."
          },
          {
            id: 'ef_q4_c',
            text: 'Skip the repair to keep saving',
            isCorrect: false,
            feedback: "A car repair is a legitimate emergency!"
          }
        ],
        correctFeedback: "Right! Use it, then rebuild it. That's how emergency funds work.",
        incorrectFeedback: "Emergency funds exist to be used for real emergencies."
      },
      {
        id: 'ef_q5',
        questionNumber: 5,
        situation: "Perfect! Alex uses $250 from their emergency fund, leaving $50. They continue saving $100/month. After 6 more months, they're back to $650 saved. Now a friend invites Alex on a last-minute weekend trip for $400.",
        question: "Should Alex use their emergency fund for the trip?",
        options: [
          {
            id: 'ef_q5_a',
            text: 'Yes, this is a rare opportunity',
            isCorrect: false,
            feedback: "This isn't an emergency - it's a want, not a need."
          },
          {
            id: 'ef_q5_b',
            text: 'No, save separately for fun activities',
            isCorrect: true,
            feedback: "Perfect! Emergency funds are only for true emergencies."
          },
          {
            id: 'ef_q5_c',
            text: 'Yes, but only use half ($200)',
            isCorrect: false,
            feedback: "Still not an emergency! Keep those funds separate."
          }
        ],
        correctFeedback: "Excellent work! You understand the discipline needed for financial health.",
        incorrectFeedback: "Remember: emergency funds are for emergencies, not opportunities."
      }
    ]
  },
  {
    id: 'medium_credit_card',
    title: 'Credit Card Crisis',
    difficulty: ScenarioDifficulty.MEDIUM,
    description: 'Navigate credit card debt and learn smart repayment strategies',
    totalQuestions: 5,
    expReward: 150,
    coinReward: 75,
    questions: [
      {
        id: 'cc_q1',
        questionNumber: 1,
        situation: "Welcome back! Meet Jordan. They have $3,000 in credit card debt across two cards: Card A has $2,000 at 22% APR, Card B has $1,000 at 18% APR. Jordan can afford to pay $300/month total toward these debts.",
        question: "Which debt repayment strategy should Jordan use?",
        options: [
          {
            id: 'cc_q1_a',
            text: 'Pay minimum on both, save the rest',
            isCorrect: false,
            feedback: "Interest will keep growing! Attack the debt aggressively."
          },
          {
            id: 'cc_q1_b',
            text: 'Pay minimum on A, focus extra on B (Avalanche method)',
            isCorrect: false,
            feedback: "Close! But Card A has higher interest - pay that first."
          },
          {
            id: 'cc_q1_c',
            text: 'Pay minimum on B, focus extra on A (Avalanche method)',
            isCorrect: true,
            feedback: "Perfect! Pay off highest interest rate first to save money."
          }
        ],
        correctFeedback: "You understand the avalanche method! This saves the most on interest.",
        incorrectFeedback: "The avalanche method targets the highest interest rate first."
      },
      {
        id: 'cc_q2',
        questionNumber: 2,
        situation: "Good choice! Jordan pays minimums ($25 on each card) and puts the remaining $250 toward Card A. After 3 months, Card A is down to $1,200. Then Jordan's hours at work get cut and they can only pay $150/month total now.",
        question: "What should Jordan do?",
        options: [
          {
            id: 'cc_q2_a',
            text: 'Stop all payments and explain to credit card companies',
            isCorrect: false,
            feedback: "This will destroy credit score and add late fees!"
          },
          {
            id: 'cc_q2_b',
            text: 'Pay minimum on both cards ($50 total), use extra $100 on highest interest',
            isCorrect: true,
            feedback: "Smart! Always pay minimums first, then tackle high interest debt."
          },
          {
            id: 'cc_q2_c',
            text: 'Skip one card entirely to pay more on the other',
            isCorrect: false,
            feedback: "Missing payments hurts your credit and adds late fees."
          }
        ],
        correctFeedback: "Exactly! Minimum payments protect your credit during tough times.",
        incorrectFeedback: "Always pay minimum on all debts to avoid penalties."
      },
      {
        id: 'cc_q3',
        questionNumber: 3,
        situation: "Jordan maintains minimum payments and their credit score stays intact. After 2 months, work hours return to normal. Jordan gets a pre-approved offer for a new credit card with 0% APR for 12 months on balance transfers, with a 3% transfer fee.",
        question: "Should Jordan transfer their $2,100 remaining debt to this new card?",
        options: [
          {
            id: 'cc_q3_a',
            text: 'No, avoid opening new credit cards',
            isCorrect: false,
            feedback: "In this case, it could save significant money on interest!"
          },
          {
            id: 'cc_q3_b',
            text: 'Yes, the 3% fee ($63) is less than 12 months of interest',
            isCorrect: true,
            feedback: "Great analysis! This saves hundreds in interest charges."
          },
          {
            id: 'cc_q3_c',
            text: 'Only transfer Card A, keep Card B as is',
            isCorrect: false,
            feedback: "Transfer both to save interest on all debt!"
          }
        ],
        correctFeedback: "You ran the numbers! Strategic balance transfers can accelerate debt payoff.",
        incorrectFeedback: "Calculate: 3% fee vs. 12 months of 18-22% interest."
      },
      {
        id: 'cc_q4',
        questionNumber: 4,
        situation: "Excellent thinking! Jordan transfers the debt, pays the $63 fee, and now has $2,163 at 0% APR for 12 months. They're paying $300/month again. After 7 months ($2,100 paid), they have $63 left. A big sale offers 30% off electronics.",
        question: "What should Jordan do?",
        options: [
          {
            id: 'cc_q4_a',
            text: 'Take advantage of the sale using available credit',
            isCorrect: false,
            feedback: "No! This is how people stay in debt forever."
          },
          {
            id: 'cc_q4_b',
            text: 'Finish paying off the debt first, then save for electronics',
            isCorrect: true,
            feedback: "Perfect! Sales happen all the time. Freedom from debt is rare."
          },
          {
            id: 'cc_q4_c',
            text: 'Buy with cash, pause debt payments for one month',
            isCorrect: false,
            feedback: "Stay focused on the debt elimination goal!"
          }
        ],
        correctFeedback: "You resisted temptation! This discipline leads to financial success.",
        incorrectFeedback: "Avoid new purchases until debt is gone."
      },
      {
        id: 'cc_q5',
        questionNumber: 5,
        situation: "Jordan stays disciplined and pays off all debt in 8 months! Now they have the same two original cards (both at $0 balance) plus the balance transfer card (also $0). Jordan only needs one card for emergencies.",
        question: "Which cards should Jordan keep?",
        options: [
          {
            id: 'cc_q5_a',
            text: 'Keep the oldest card, close newer ones',
            isCorrect: true,
            feedback: "Perfect! Length of credit history helps your credit score."
          },
          {
            id: 'cc_q5_b',
            text: 'Keep the card with highest limit',
            isCorrect: false,
            feedback: "Credit age matters more than limit for long-term credit health."
          },
          {
            id: 'cc_q5_c',
            text: 'Close all cards and use only cash',
            isCorrect: false,
            feedback: "You need some credit history to maintain a good credit score."
          }
        ],
        correctFeedback: "Excellent! You understand credit management fundamentals.",
        incorrectFeedback: "Keep your oldest card to maintain credit history length."
      }
    ]
  },
  {
    id: 'hard_investment',
    title: 'Investment Opportunity',
    difficulty: ScenarioDifficulty.HARD,
    description: 'Make complex investment decisions with limited information',
    totalQuestions: 5,
    expReward: 200,
    coinReward: 100,
    questions: [
      {
        id: 'inv_q1',
        questionNumber: 1,
        situation: "This is an advanced scenario. Meet Sam, age 28, making $65,000/year. They have $15,000 saved: $6,000 emergency fund (4 months expenses), $9,000 ready to invest. Sam's employer offers 401(k) matching up to 5% of salary. Sam currently contributes 3%.",
        question: "What should Sam's FIRST move be?",
        options: [
          {
            id: 'inv_q1_a',
            text: 'Invest all $9,000 in index funds',
            isCorrect: false,
            feedback: "Not yet! Sam is leaving free money on the table."
          },
          {
            id: 'inv_q1_b',
            text: 'Increase 401(k) contribution to 5% to get full employer match',
            isCorrect: true,
            feedback: "Perfect! Employer match is a guaranteed 100% return!"
          },
          {
            id: 'inv_q1_c',
            text: 'Build emergency fund to 6 months first',
            isCorrect: false,
            feedback: "4 months is adequate. The employer match is more urgent!"
          }
        ],
        correctFeedback: "You prioritized the guaranteed return! That's advanced thinking.",
        incorrectFeedback: "Never leave employer matching funds unclaimed - it's free money!"
      },
      {
        id: 'inv_q2',
        questionNumber: 2,
        situation: "Smart! Sam increases to 5% (costing $135/month more) and gets $135/month from employer. Now about that $9,000. Sam's friend says 'I made 40% returns day-trading crypto!' Another friend says 'Just buy an S&P 500 index fund, boring but reliable.'",
        question: "What should Sam do?",
        options: [
          {
            id: 'inv_q2_a',
            text: 'Put $5,000 in crypto, $4,000 in index funds (diversify)',
            isCorrect: false,
            feedback: "That's not diversification - that's speculation plus investing."
          },
          {
            id: 'inv_q2_b',
            text: 'All $9,000 in S&P 500 index fund for long-term growth',
            isCorrect: true,
            feedback: "Excellent! Time in market beats timing the market."
          },
          {
            id: 'inv_q2_c',
            text: 'Wait for a market crash to buy stocks cheaper',
            isCorrect: false,
            feedback: "Timing the market is nearly impossible. Time in market wins."
          }
        ],
        correctFeedback: "You avoided FOMO and speculation! That's mature investing.",
        incorrectFeedback: "Past performance doesn't predict future results. Stick with proven strategies."
      },
      {
        id: 'inv_q3',
        questionNumber: 3,
        situation: "Sam invests $9,000 in a low-cost S&P 500 index fund. After 6 months, the market drops 15%. Sam's investment is now worth $7,650 (down $1,350). Sam's friend who day-traded is down 60%. Sam's panicking.",
        question: "What should Sam do?",
        options: [
          {
            id: 'inv_q3_a',
            text: 'Sell everything to prevent further losses',
            isCorrect: false,
            feedback: "That locks in the loss! Markets recover over time."
          },
          {
            id: 'inv_q3_b',
            text: 'Do nothing. Continue monthly 401(k) contributions.',
            isCorrect: true,
            feedback: "Perfect! You're buying more shares at lower prices now."
          },
          {
            id: 'inv_q3_c',
            text: 'Move everything to savings account',
            isCorrect: false,
            feedback: "You'd lose to inflation and lock in losses. Stay the course!"
          }
        ],
        correctFeedback: "You have the emotional discipline successful investors need!",
        incorrectFeedback: "Market volatility is normal. Long-term investors don't panic sell."
      },
      {
        id: 'inv_q4',
        questionNumber: 4,
        situation: "Sam stays invested. After 18 months, the market recovered and is up 20% from Sam's original investment. Sam's $9,000 is now $10,800. Plus 18 months of 401(k) contributions ($4,860 from Sam + $4,860 match = $9,720). Sam's friend mentions Roth IRA.",
        question: "What should Sam consider about Roth IRA?",
        options: [
          {
            id: 'inv_q4_a',
            text: 'Contribute $6,500/year (the max) to Roth IRA',
            isCorrect: false,
            feedback: "Can Sam afford that much? Let's think about their situation."
          },
          {
            id: 'inv_q4_b',
            text: 'Contribute what they can afford after 401(k) match is maxed',
            isCorrect: true,
            feedback: "Right! Priority: 401(k) match, then Roth IRA, then more 401(k)."
          },
          {
            id: 'inv_q4_c',
            text: 'Skip Roth IRA, only do 401(k)',
            isCorrect: false,
            feedback: "Roth IRA offers tax-free growth! It's a great complement to 401(k)."
          }
        ],
        correctFeedback: "You understand the retirement account priority ladder!",
        incorrectFeedback: "After getting full employer match, Roth IRA is typically next."
      },
      {
        id: 'inv_q5',
        questionNumber: 5,
        situation: "Final question! Sam is now 30 years old. Total invested: $25,000 over 2 years. Current value: $28,000. Sam just got a $10,000 raise! Their friend says 'Now you can afford a financial advisor who charges 1% of assets annually ($280/year now, growing with your portfolio).'",
        question: "Should Sam hire this advisor?",
        options: [
          {
            id: 'inv_q5_a',
            text: 'Yes, professional advice is worth 1%',
            isCorrect: false,
            feedback: "For Sam's simple situation? That 1% compounds into huge lost returns!"
          },
          {
            id: 'inv_q5_b',
            text: 'No, continue with low-cost index funds independently',
            isCorrect: true,
            feedback: "Perfect! Over 30 years, that 1% fee could cost $100,000+!"
          },
          {
            id: 'inv_q5_c',
            text: 'Hire advisor only for initial planning, then go solo',
            isCorrect: false,
            feedback: "Sam's situation is straightforward enough. Save the fees!"
          }
        ],
        correctFeedback: "You understand how fees compound! You're ready for real investing.",
        incorrectFeedback: "For simple index fund investing, advisors charging 1% aren't worth it."
      }
    ]
  }
];
