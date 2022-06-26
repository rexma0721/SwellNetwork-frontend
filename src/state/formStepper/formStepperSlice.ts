import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  currentStep: number;
  maxStep: number;
} = {
  currentStep: 0,
  maxStep: 15,
};

export const formStepperSlice = createSlice({
  name: 'formStepper',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
  },
});

export const { setCurrentStep } = formStepperSlice.actions;

export default formStepperSlice.reducer;
