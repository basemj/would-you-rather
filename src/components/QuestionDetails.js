import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const QuestionDetails = props => {
  const {
    question,
    author,
    isAnswered,
    answeredOption,
    optionOneCount,
    optionOnePercentage,
    optionTwoCount,
    optionTwoPercentage,
  } = props;

  if (!question) {
    return (
      <div>
        Cannot find question. Return to
        <Link to="/">Home</Link>
      </div>
    );
  }

  return (
    <div>
      <img src={`/assets/${author.avatarURL}`} alt="" />
      <span>
        {author.name}
      </span>
      asks...

      <p>would you rather...</p>
      <p>
        a.
        {question.optionOne.text}
        {optionOnePercentage}
        %
        {optionOneCount}
      </p>
      { isAnswered ? <span>A</span> : <input type="button" value="A" /> }

      <p>
        b.
        {question.optionTwo.text}
        {optionTwoPercentage}
        %
        {optionTwoCount}
      </p>
      { isAnswered ? <span>B</span> : <input type="button" value="B" /> }

      { isAnswered && (
        <p>
          you answered
          {'I would rather '}
          {question[answeredOption].text}
        </p>
      )}
    </div>
  );
};

QuestionDetails.propTypes = {
  answeredOption: PropTypes.string,
  author: PropTypes.shape({
    id: PropTypes.string,
    avatarURL: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  isAnswered: PropTypes.bool.isRequired,
  optionOneCount: PropTypes.number,
  optionOnePercentage: PropTypes.number,
  optionTwoCount: PropTypes.number,
  optionTwoPercentage: PropTypes.number,
  question: PropTypes.shape({
    optionOne: PropTypes.object,
    optionTwo: PropTypes.object,
  }).isRequired
};

QuestionDetails.defaultProps = {
  answeredOption: '',
  optionOneCount: 0,
  optionOnePercentage: 0,
  optionTwoCount: 0,
  optionTwoPercentage: 0,
};

const mapStateToProps = ({ authedUser, users, questions }, ownProps) => {
  const { questionId } = ownProps;
  const question = questions[questionId];
  const author = question && users[question.author];
  const isAnswered = question &&
  [
    ...question.optionOne.votes,
    ...question.optionTwo.votes
  ].includes(authedUser);

  const optionOneCount = question && question.optionOne.votes.length;
  const optionTwoCount = question && question.optionTwo.votes.length;

  const optionOnePercentage = 100 / (optionOneCount + optionTwoCount) * optionOneCount;
  const optionTwoPercentage = 100 / (optionOneCount + optionTwoCount) * optionTwoCount;

  const answeredOption = isAnswered &&
    question.optionOne.votes.includes(authedUser) ? 'optionOne' : 'optionTwo';

  return {
    question,
    author,
    isAnswered,
    answeredOption,
    optionOneCount,
    optionOnePercentage,
    optionTwoCount,
    optionTwoPercentage,
  };
};

export default connect(mapStateToProps)(QuestionDetails);
