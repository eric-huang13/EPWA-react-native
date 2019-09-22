import * as yup from 'yup';
import T from 'prop-types';

export const dateEventProps = T.shape({
  category: T.string,
  endDate: T.number,
  id: T.number,
  localId: T.number,
  startDate: T.number,
  type: T.string,
});

export const dateEventValidation = yup.object().shape({
  category: yup.string().required('Required'),
  type: yup.string().required('Required'),
  startDate: yup.number().required('Required'),
  endDate: yup.number().required('Required'),
  data: yup
    .object()
    .shape({
      sharedAreaWithOtherAnimals: yup.string(),
    })
    .notRequired(),
});

export const quantityEventProps = T.shape({
  category: T.string,
  id: T.number,
  localId: T.number,
  startDate: T.number,
  type: T.string,
  data: T.shape({
    name: T.string,
    quantity: T.number,
    unit: T.string,
  }),
});

export const quantityEventValidation = yup.object().shape({
  category: yup.string().required('Required'),
  type: yup.string().required('Required'),
  startDate: yup.number().required('Required'),
  recurring: yup.string().nullable(),
  recurrintTill: yup.string().nullable(),
  data: yup.object().shape({
    name: yup.string().required('Required'),
    quantity: yup.number().required('Required'),
    unit: yup.string().required('Required'),
  }),
});

export const quantityWithoutNameEventValidation = yup.object().shape({
  category: yup.string().required('Required'),
  type: yup.string().required('Required'),
  startDate: yup.number().required('Required'),
  data: yup.object().shape({
    quantity: yup.number().required('Required'),
    unit: yup.string().required('Required'),
  }),
});

export const nameEventValidation = yup.object().shape({
  category: yup.string().required('Required'),
  type: yup.string().required('Required'),
  startDate: yup.number().required('Required'),
  data: yup.object().shape({
    name: yup.string().required('Required'),
  }),
});
