import { Button, Flex, Box } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";
import FormInput from "../../components/formComponents/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PageNumbers } from "../../interface/home";
import { IJobDetails } from "../../interface/forms";
import { useData } from "./DataProvider";

const FormSelect = dynamic(() => import("../../components/formComponents/FormSelect"), { ssr: false });

const JobDetailsForm: React.FC<{
  handleTab: (n: PageNumbers) => void;
}> = ({ handleTab }) => {
  const { state, setState } = useData();

  const { 
    handleChange: formikHandleChange, 
    errors, 
    touched, 
    handleBlur, 
    handleSubmit, 
    values,
    validateForm,
    setTouched
  } = useFormik<IJobDetails>({
    initialValues: state.jobDetails,
    validationSchema: Yup.object().shape({
      jobTitle: Yup.string().required("Job Title is required"),
      jobDetails: Yup.string().required("Job Details is required"),
      jobLocation: Yup.string().required("Job Location is required"),
      // jobPosition: Yup.string().required("Job position is required"),
    }),
    onSubmit: (values) => {
      setState((prev) => ({
        ...prev,
        jobDetails: values,
      }));
      handleTab(2);
    },
  });

  // Add real-time update handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formikHandleChange(e); // Handle Formik state
    // Update global state immediately
    setState(prev => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleNext = async () => {
    // Touch all fields to trigger validation
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as any);
    setTouched(touchedFields);

    // Validate all fields
    const errors = await validateForm();
    
    // If no errors, submit the form
    if (Object.keys(errors).length === 0) {
      handleSubmit();
    }
  };

  return (
    <Box width="100%" as="form" onSubmit={handleSubmit as any}>
      <Box width="100%">
        <FormInput
          label="Job Title"
          placeholder="Enter job title"
          name="jobTitle"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.jobTitle}
          error={errors?.jobTitle}
          touched={touched?.jobTitle}
        />
        <FormInput
          label="Job Details"
          placeholder="Enter job details"
          name="jobDetails"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.jobDetails}
          error={errors?.jobDetails}
          touched={touched?.jobDetails}
        />
        <FormInput
          label="Job Location"
          name="jobLocation"
          placeholder="Enter job location"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.jobLocation}
          touched={touched.jobLocation}
          value={values.jobLocation}
        />
        <Flex w="100%" justify="flex-end" mt="4rem" gap="20px">
          <Button colorScheme="gray" type="button" onClick={() => handleTab(0)}>
            Previous
          </Button>
          <Button colorScheme="red" type="button" onClick={handleNext}>
            Next
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default JobDetailsForm;
