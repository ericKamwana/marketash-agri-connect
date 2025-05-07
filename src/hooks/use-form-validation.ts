
import { useState } from "react";
import { ZodSchema } from "zod";

export function useFormValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (data: unknown): data is T => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const path = err.path.join(".");
            formattedErrors[path] = err.message;
          }
        });
      }
      
      setErrors(formattedErrors);
      return false;
    }
  };

  const validateField = (fieldName: string, value: unknown) => {
    try {
      // Create a partial schema for just this field
      const partialData = { [fieldName]: value };
      schema.pick({ [fieldName]: true } as any).parse(partialData);
      
      // Clear error for this field if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      return true;
    } catch (error: any) {
      // Set error for just this field
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            setErrors(prev => ({
              ...prev,
              [fieldName]: err.message
            }));
          }
        });
      }
      return false;
    }
  };

  return {
    errors,
    validateForm,
    validateField,
    hasErrors: Object.keys(errors).length > 0
  };
}
