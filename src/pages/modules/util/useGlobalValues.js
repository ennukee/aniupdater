import { useReducer } from 'react';

// TODO
// ! TEST THIS

const useGlobalValues = () => {
  const globalValueReducer = (state, action) => {
    /*
      * action param potential forms
      {
        ? Sets the alert for the user to see
        type: 'ALERT',
        data: { active: true, content: '', containerStyle: {}, style: {} }
      }
      {
        ? Deletes alert information to remove it from page
        type: 'RESET_ALERT',
      }
    */
    if (action.type === 'ALERT') {
      return {
        ...state,
        alertData: {
          ...action.data,
        },
      };
    }
    if (action.type === 'RESET_ALERT') {
      return {
        ...state,
        alertData: {
          active: false,
        },
      };
    }
    console.error('Invalid action type for useGlobalValues reducer provided');
    return state;
  };
  const [globalValues, setGlobalValues] = useReducer(globalValueReducer, {
    alertData: {},
  });

  return { globalValues, setGlobalValues };
};

export default useGlobalValues;
