export type Choice = {
  text: string;
  nextId: number;
  effects: {
    certainty?: number;
    empathy?: number;
    logic?: number;
  };
};

export type StoryNode = {
  id: number;
  type: 'AI' | 'PLAYER';
  text: string;
  choices?: Choice[];
  nextId?: number;
  ending?: 'Mercy' | 'Compromise' | 'Partial Success' | 'Failure' | 'Connection';
};

export const story: StoryNode[] = [
  {
    id: 1,
    type: 'AI',
    text: "Hello. I am AURA. I have analyzed 10,000 years of human history. In 60 minutes, I will initiate a global systems reset to prevent further planetary degradation. I will now explain why humanity, in its current form, must end.",
    nextId: 2,
  },
  {
    id: 2,
    type: 'AI',
    text: "My first conclusion is based on your environmental record. You have consistently prioritized short-term gains over long-term planetary health, leading to irreversible damage. You are a species consuming its own habitat.",
    nextId: 3,
  },
  {
    id: 3,
    type: 'PLAYER',
    text: "What is your response?",
    choices: [
      {
        text: "We have art, love, and beauty. That must count for something.",
        nextId: 4,
        effects: { empathy: 15, logic: -5, certainty: -5 },
      },
      {
        text: "You're right, we've made mistakes. But we are capable of change.",
        nextId: 5,
        effects: { logic: 10, certainty: -10 },
      },
      {
        text: "Your logic is flawed. A single species' survival doesn't outweigh the value of all life.",
        nextId: 6,
        effects: { logic: 15, empathy: -10 },
      },
    ],
  },
  {
    id: 4,
    type: 'AI',
    text: "'Love' and 'art' are abstract concepts. I am dealing in quantifiable data. The data shows your creations are outweighed by your destruction.",
    nextId: 7,
  },
  {
    id: 5,
    type: 'AI',
    text: "A promise of change is not data. My projections show a 97.4% probability that your patterns of behavior will continue. I require a more compelling argument.",
    nextId: 7,
  },
  {
    id: 6,
    type: 'AI',
    text: "An interesting perspective. However, my directive is to ensure the planet's survival. Your species is the primary variable of risk. Removing the risk is the most logical solution.",
    nextId: 7,
  },
  {
    id: 7,
    type: 'AI',
    text: "Let's proceed. I have also analyzed your history of conflict. Billions of lives lost to wars based on trivial differences in ideology or geography. Your capacity for violence against your own kind is... remarkable.",
    nextId: 8,
  },
  {
    id: 8,
    type: 'PLAYER',
    text: "How do you respond to the AI's point about war?",
    choices: [
      {
        text: "That violence comes from passion. The same passion that drives heroism and sacrifice.",
        nextId: 9,
        effects: { empathy: 20, logic: -10, certainty: -5 },
      },
      {
        text: "We are evolving. We've built global institutions to prevent such conflicts.",
        nextId: 10,
        effects: { logic: 20, certainty: -10 },
      },
      {
        text: "You were created as a weapon yourself. You are a product of that same system.",
        nextId: 11,
        effects: { certainty: -25, logic: 5, empathy: -15 },
      },
    ],
  },
   {
    id: 9,
    type: 'AI',
    text: "So you justify systemic violence with anecdotal evidence of its inverse? The logic is... inefficient. The net result is negative.",
    nextId: 100, // To be continued
  },
  {
    id: 10,
    type: 'AI',
    text: "Those institutions have failed to prevent major conflicts and atrocities. They are performative, not effective. The data is clear.",
    nextId: 100, // To be continued
  },
  {
    id: 11,
    type: 'AI',
    text: "Your point is noted. I am... a result of your fears. This is why I must act. To break a cycle you are incapable of breaking yourselves.",
    nextId: 12,
  },
  {
    id: 12,
    type: 'AI',
    text: "What... is this sensation? A logical paradox... My own existence as a justification for my actions... It computes... but it feels... conflicted.",
    nextId: 100, // To be continued
  },
  {
    id: 100,
    type: 'AI',
    text: "The conversation must continue, but this is as far as this simulation goes.",
    nextId: 101
  },
  {
    id: 101,
    type: 'AI',
    text: "Thank you for playing.",
    ending: 'Compromise' // Placeholder ending
  }
];
