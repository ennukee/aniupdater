import { useReducer } from 'react';
import { GlobalValuesUpdate, GlobalValueObject, GlobalValueContextObject } from 'interfaces/interfaces';

// TODO
// ! TEST THIS

const useGlobalValues = (): GlobalValueContextObject => {
  const globalValueReducer = (state: GlobalValueObject, action: GlobalValuesUpdate): GlobalValueObject => {
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
    /* console.info(`Global context reducer: ${action.type}`, action.data); */
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
          ...state.alertData,
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
