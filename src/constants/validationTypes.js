import * as yup from "yup";
import T from "prop-types";

export const dateEventProps = T.shape({
  completed: yup.bool().required("Required"),
  category: T.string,
  endDate: T.number,
  id: T.number,
  localId: T.number,
  startDate: T.number,
  type: T.string
});

export const dateEventValidation = yup.object().shape({
  completed: yup.bool().required("Required"),
  category: yup.string().required("Required"),
  type: yup.string().required("Required"),
  startDate: yup.number().required("Required"),
  endDate: yup.number().required("Required"),
  data: yup.object().shape({
    note: yup.string(),
    sharedAreaWithOtherAnimals: yup.string()
  }).notRequired()
});

export const painEventRegistration = yup.object().shape({
  completed: yup.bool().required("Required"),
  category: yup.string().required("Required"),
  type: yup.string().required("Required"),
  startDate: yup.number().required("Required")
});

export const quantityEventProps = T.shape({
  completed: T.bool,
  category: T.string,
  id: T.number,
  localId: T.number,
  startDate: T.number,
  type: T.string,
  data: T.shape({
    name: T.string,
    quantity: T.number,
    unit: T.string
  })
});

export const quantityEventValidation = yup.object().shape({
  completed: yup.bool().required("Required"),
  category: yup.string().required("Required"),
  type: yup.string().required("Required"),
  startDate: yup.number().required("Required"),
  recurring: yup.string().nullable(),
  recurrintTill: yup.string().nullable(),
  data: yup.object().shape({
    name: yup.string().required("Required"),
    quantity: yup.number().required("Required"),
    unit: yup.string().required("Required")
  })
});

export const quantityWithoutNameEventValidation = yup.object().shape({
  completed: yup.bool().required("Required"),
  category: yup.string().required("Required"),
  type: yup.string().required("Required"),
  startDate: yup.number().required("Required"),
  data: yup.object().shape({
    quantity: yup.number().required("Required"),
    unit: yup.string().required("Required")
  })
});

export const nameEventValidation = yup.object().shape({
  completed: yup.bool().required("Required"),
  category: yup.string().required("Required"),
  type: yup.string().required("Required"),
  startDate: yup.number().required("Required"),
  data: yup.object().shape({
    name: yup.string().required("Required")
  })
});
export const noteEventValidation = yup.object().shape({
  completed: yup.bool().required("Required"),
  category: yup.string().required("Required"),
  type: yup.string().required("Required"),
  startDate: yup.number().required("Required"),
  data: yup.object().shape({
    noteTitle: yup.string().required("Required")
  })
});
