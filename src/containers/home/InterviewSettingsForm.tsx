import { Button, Flex, Box } from "@chakra-ui/react";
import React from "react";
import dynamic from "next/dynamic";
import { useFormik } from "formik";
import { PageNumbers } from "../../interface/home";
import * as Yup from "yup";
import { IInterViewSettings } from "../../interface/forms";
import {
  interviewDurationOptions,
  interviewLanguageOptions,
  interviewModeOptions,
} from "./constants";
import { useData } from "./DataProvider";

const FormSelect = dynamic(() => import("../../components/formComponents/FormSelect"), { ssr: false });

const InterviewSettingsForm: React.FC<{
  handleTab: (n: PageNumbers) => void;
}> = ({ handleTab }) => {
  const { state, setState } = useData();

  const {
    errors,
    touched,
    handleSubmit,
    values,
    setFieldTouched,
    setFieldValue: formikSetFieldValue,
  } = useFormik<IInterViewSettings>({
    initialValues: state.interviewSettings,
    validationSchema: Yup.object().shape({
      interviewMode: Yup.string().required("Interview Mode is required"),
      interviewDuration: Yup.string().required("Interview Duration is required"),
      interviewLanguage: Yup.string().required("Interview Language is required"),
    }),
    onSubmit: (values) => {
      setState((prev) => ({
        ...prev,
        interviewSettings: values,
      }));
      alert("Form successfully submitted");
    },
  });

  const handleSelectChange = (name: string, value: any) => {
    formikSetFieldValue(name, value);
    setState(prev => ({
      ...prev,
      interviewSettings: {
        ...prev.interviewSettings,
        [name]: value
      }
    }));
  };

  return (
    <Box width="100%" as="form" onSubmit={handleSubmit as any}>
      <Box width="100%">
        <FormSelect
          label="Interview Mode"
          placeholder="Select interview mode"
          name="interviewMode"
          options={interviewModeOptions}
          onChange={handleSelectChange}
          onBlur={setFieldTouched}
          value={values?.interviewMode}
          error={errors?.interviewMode}
          touched={touched?.interviewMode}
        />
        <FormSelect
          label="Interview Duration"
          placeholder="Select interview duration"
          name="interviewDuration"
          options={interviewDurationOptions}
          onChange={handleSelectChange}
          onBlur={setFieldTouched}
          value={values?.interviewDuration}
          error={errors?.interviewDuration}
          touched={touched?.interviewDuration}
        />
        <FormSelect
          label="Interview Language"
          name="interviewLanguage"
          placeholder="Select interview language"
          options={interviewLanguageOptions}
          onChange={handleSelectChange}
          onBlur={setFieldTouched}
          error={errors.interviewLanguage}
          touched={touched.interviewLanguage}
          value={values.interviewLanguage}
        />
        <Flex w="100%" justify="flex-end" mt="4rem" gap="20px">
          <Button colorScheme="gray" type="button" onClick={() => handleTab(1)}>
            Previous
          </Button>
          <Button colorScheme="red" type="submit">
            Submit
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default InterviewSettingsForm;
