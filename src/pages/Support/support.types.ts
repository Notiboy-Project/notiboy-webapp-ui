

export const FAQS_DATA: SupportDto[] = [
  {
    id: 1,
    question: 'What is the cost of creating a channel?',
    answer: 'Channel creation and verification is free of cost.'
  },
  {
    id: 1,
    question: 'How much does it cost to send notifications ?',
    answer: 'Sending notifications is free of cost.But in free tire there will be restrictions in the number of notifications that can be sent.'
  },
  {
    id: 1,
    question: 'How can I start receiving notifications ?',
    answer: 'You can start getting notifications by opting -in to a channel.When you opt - out of a channel you will stop getting notifications.'
  },
  {
    id: 1,
    question: ' Can I get notifications via email and discord ?',
    answer: ` Yes, you can start getting notifications by verifying your email - id.To get notifications via discord,
  you have to verify and then join penguin labs discord where the bot which sends you
  notification lives.`
  },
  {
    id: 1,
    question: ' Are there any premium plans ?',
    answer: `Yes, premium plans cost USD 9 and USD 29 per month which will give you access to extra features.`
  },











]

export interface SupportDto {
  id?: number
  question: string;
  answer: string
}