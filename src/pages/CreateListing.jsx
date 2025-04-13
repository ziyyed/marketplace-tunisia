import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Container, Typography, Button, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import { listings } from '../services/api';
import { toast } from 'react-toastify';

const CreateListing = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  const createListingMutation = useMutation({
    mutationFn: (data) => listings.create(data),
    onSuccess: () => {
      toast.success('Listing created successfully!');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    },
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    category: Yup.string().required('Category is required'),
    location: Yup.string().required('Location is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });
    images.forEach(image => {
      formData.append('images', image);
    });

    createListingMutation.mutate(formData);
    setSubmitting(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Listing
      </Typography>
      <Formik
        initialValues={{
          title: '',
          description: '',
          price: '',
          category: '',
          location: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Field
                component={TextField}
                name="title"
                label="Title"
                fullWidth
              />
              <Field
                component={TextField}
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
              />
              <Field
                component={TextField}
                name="price"
                label="Price"
                type="number"
                fullWidth
              />
              <Field
                component={TextField}
                name="category"
                label="Category"
                fullWidth
              />
              <Field
                component={TextField}
                name="location"
                label="Location"
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Create Listing
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default CreateListing; 