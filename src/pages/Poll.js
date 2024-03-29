import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router';
import Button from '../components/Button';
import NotFound from './NotFound';
import Card from '../components/Card';
import { saveQuestionAnswer } from '../reducers/questions';

const Poll = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const users = useSelector((store) => store.users);
  const question = useSelector((store) =>
    store.questions.filter((q) => q.id === location.pathname.split('/')[2])
  )[0];

  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState('optionOne');

  const handleSubmit = () => {
    dispatch(
      saveQuestionAnswer({
        authedUser: user?.id,
        qid: question?.id,
        answer: selectedOption,
      })
      );
      user.answers[question?.id] = selectedOption;
      dispatch({
      type: 'UPDATE_USERS',
      payload: users.filter((u) => u.id !== user.id).concat([user]),
    });
    setShowResults(true);
  };
  
  useEffect(() => {
    if (user?.answers && user?.answers[question?.id]) {
      setSelectedOption(user?.answers[question?.id]);
      setShowResults(true);
    }
  }, [user, question]);
  
  if(!question) return <NotFound />
  if (!user?.id) return <Redirect to={`/signin?rp=${location.pathname}`} />;

  return (
    <div className='poll'>
      <Card title={`${users.filter(u => u.id === question.author)[0].name} Asks:`}>
        <div className='grid-flex'>
          <div className='grid-flex-one'>
            <img src={users.filter(u => u.id === question.author)[0].avatarURL} alt={question.author} />
          </div>
          <div className='grid-flex-two'>
            {' '}
            {!showResults ? (
              <div className='poll-question'>
                <h2>Would You Rather...</h2>

                <div className='poll-options'>
                  <div>
                    <label>
                      <input
                        type='radio'
                        name='options'
                        value='optionOne'
                        checked={selectedOption === 'optionOne'}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      {question?.optionOne.text}
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        type='radio'
                        name='options'
                        value='optionTwo'
                        onChange={(e) => setSelectedOption(e.target.value)}
                        checked={selectedOption === 'optionTwo'}
                      />
                      {question?.optionTwo.text}
                    </label>
                  </div>
                </div>
                <Button text='Submit' onClick={handleSubmit} />
              </div>
            ) : (
              <div className='poll-results'>
                <h2>Results</h2>

                <div className='poll-options'>
                  <div>
                    {selectedOption === 'optionOne' ? '✅ ' : ''}
                    {question?.optionOne.text}({question.optionOne.votes.length}
                    /
                    {
                      question.optionOne.votes.concat(question.optionTwo.votes)
                        .length
                    }
                    ) (
                    {Math.ceil(
                      (question.optionOne.votes.length * 100) /
                        question.optionOne.votes.concat(
                          question.optionTwo.votes
                        ).length
                    )}
                    %)
                  </div>

                  <div>
                    {selectedOption === 'optionTwo' ? '✅ ' : ''}
                    {question?.optionTwo.text}({question.optionTwo.votes.length}
                    /
                    {
                      question.optionOne.votes.concat(question.optionTwo.votes)
                        .length
                    }
                    ) (
                    {Math.ceil(
                      (question.optionTwo.votes.length * 100) /
                        question.optionOne.votes.concat(
                          question.optionTwo.votes
                        ).length
                    )}
                    %)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Poll;
