import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KNOWLEDGE_QUIZ } from '../data/clinicalCases';
import ClinicalScenariosModule from './ClinicalScenariosModule';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function openQuiz() {
  fireEvent.click(screen.getByRole('button', { name: 'Knowledge Check Quiz (10 Qs)' }));
}

function answerCurrentQuestion(questionIndex: number) {
  const question = KNOWLEDGE_QUIZ[questionIndex];
  expect(screen.getByText(question.question)).toBeInTheDocument();
  const answerText = screen.getByText(question.options[question.correctIndex], { exact: true });
  const answerButton = answerText.closest('button');
  if (!answerButton) throw new Error('The correct answer option is not inside a button.');
  fireEvent.click(answerButton);
}

describe('clinical knowledge quiz question order', () => {
  it('shuffles all ten questions, scores answers against the matching questions, and reshuffles on restart', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<ClinicalScenariosModule />);
    openQuiz();

    // Fisher-Yates with zero consistently rotates the first question to the end.
    const expectedOrder = [...KNOWLEDGE_QUIZ.slice(1), KNOWLEDGE_QUIZ[0]];
    for (let displayIndex = 0; displayIndex < expectedOrder.length; displayIndex += 1) {
      const question = expectedOrder[displayIndex];
      const originalIndex = KNOWLEDGE_QUIZ.findIndex(item => item.id === question.id);
      answerCurrentQuestion(originalIndex);
      fireEvent.click(screen.getByRole('button', {
        name: displayIndex === expectedOrder.length - 1 ? 'View Final Score' : 'Next Question'
      }));
    }

    expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
    expect(screen.getByText('10 / 10')).toBeInTheDocument();

    random.mockReturnValue(0.999999);
    fireEvent.click(screen.getByRole('button', { name: 'Restart Quiz' }));
    expect(screen.getByText(KNOWLEDGE_QUIZ[0].question)).toBeInTheDocument();
  });

  it('creates a fresh question order each time the quiz tab is entered', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<ClinicalScenariosModule />);

    openQuiz();
    expect(screen.getByText(KNOWLEDGE_QUIZ[1].question)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clinical Scenarios (5 Cases)' }));
    random.mockReturnValue(0.999999);
    openQuiz();

    expect(screen.getByText(KNOWLEDGE_QUIZ[0].question)).toBeInTheDocument();
  });
});
