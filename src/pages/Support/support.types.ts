export const FAQS_DATA: SupportDto[] = [
  {
    id: 1,
    question: 'What is the cost of creating a channel?',
    answer: 'Channel creation and verification is free of cost.'
  },
  {
    id: 2,
    question: 'How much does it cost to send notifications ?',
    answer:
      'Sending notifications is free of cost. But in free tier there will be restrictions in the number of notifications that can be sent.'
  },
  {
    id: 3,
    question: 'How can I start receiving notifications ?',
    answer: `You can start receiving notifications by opting-in to a channel. When you 
      opt-out of a channel you will stop receiving notifications. It is free to opt-in and opt-out of a channel.`
  },
  {
    id: 4,
    question: 'Can I get notifications via email and discord ?',
    answer: ` Yes, you can start getting notifications via discord & email by verifying via settings page.`
  },
  {
    id: 5,
    question: ' Are there any premium plans ?',
    answer: `Yes, there are premium plans for the channel creator. Visit billing section for details.`
  }
];

export interface SupportDto {
  id?: number;
  question: string;
  answer: string;
}
