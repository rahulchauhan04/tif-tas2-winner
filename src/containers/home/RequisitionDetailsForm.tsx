import { Button, Flex, Box } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";
import FormInput from "../../components/formComponents/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PageNumbers } from "../../interface/home";
import { IRequisitionDetails } from "../../interface/forms";
import { genderOptions, urgencyOptions } from "./constants";
import { useData } from "./DataProvider";

const FormSelect = dynamic(() => import("../../components/formComponents/FormSelect"), { ssr: false });

const RequisitionDetailsForm: React.FC<{
  handleTab: (n: PageNumbers) => void;
}> = ({ handleTab }) => {
  const { state, setState } = useData();

  const {
    handleChange: formikHandleChange,
    setFieldValue: formikSetFieldValue,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    values,
    setFieldTouched,
    isValid,
  } = useFormik<IRequisitionDetails>({
    initialValues: state.requisitionDetails,
    validationSchema: Yup.object().shape({
      requisitionTitle: Yup.string().required("Requisition title is required"),
      noOfOpenings: Yup.number()
        .typeError("Enter a valid number")
        .required("Number of openings is required")
        .positive("Enter a valid number")
        .min(1, "Enter a valid number"),
      urgency: Yup.string().required("Urgency is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    onSubmit: (values) => {
      setState((prev) => ({
        ...prev,
        requisitionDetails: values,
      }));
      handleTab(1);
    },
  });

  // Add real-time update handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formikHandleChange(e);
    setState(prev => ({
      ...prev,
      requisitionDetails: {
        ...prev.requisitionDetails,
        [e.target.name]: e.target.name === 'noOfOpenings' ? Number(e.target.value) : e.target.value
      }
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    formikSetFieldValue(name, value);
    setState(prev => ({
      ...prev,
      requisitionDetails: {
        ...prev.requisitionDetails,
        [name]: value
      }
    }));
  };

  return (
    <Box width="100%" as="form" onSubmit={handleSubmit as any}>
      <Box width="100%">
        <FormInput
          label="Requisition Title"
          placeholder="Enter requisition title"
          name="requisitionTitle"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.requisitionTitle}
          error={errors?.requisitionTitle}
          touched={touched?.requisitionTitle}
        />
        <FormInput
          label="Number of openings"
          placeholder="Enter number of openings"
          name="noOfOpenings"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.noOfOpenings}
          error={errors?.noOfOpenings}
          touched={touched?.noOfOpenings}
        />
        <FormSelect
          label="Gender"
          name="gender"
          placeholder="Select gender"
          options={genderOptions}
          onChange={handleSelectChange}
          onBlur={setFieldTouched}
          error={errors.gender}
          touched={touched.gender}
          value={values.gender}
        />
        <FormSelect
          label="Urgency"
          name="urgency"
          placeholder="Select urgency"
          options={urgencyOptions}
          onChange={handleSelectChange}
          onBlur={setFieldTouched}
          error={errors.urgency}
          touched={touched.urgency}
          value={values.urgency}
        />
        <Flex w="100%" justify="flex-end" mt="4rem">
          <Button colorScheme="red" type="submit">
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default RequisitionDetailsForm;
