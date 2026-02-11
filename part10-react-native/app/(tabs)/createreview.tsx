import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { CREATE_REVIEW } from '../../graphql/queries';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 6,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

const validationSchema = yup.object().shape({
  ownerName: yup.string().required('Repository owner name is required'),
  repositoryName: yup.string().required('Repository name is required'),
  rating: yup
    .number()
    .required('Rating is required')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100'),
  text: yup.string().optional(),
});

const CreateReviewScreen = () => {
  const router = useRouter();

  const [createReview, { error }] = useMutation(CREATE_REVIEW, {
  onCompleted: (data) => {
    const repositoryId = data.createReview.repository.id;
    router.push(`/repository/${repositoryId}`);
  },
});
{error && (
  <Text style={{ color: 'red', marginBottom: 10 }}>
    {error.message}
  </Text>
)}
  const submit = (values: any) => {
    createReview({
      variables: {
        review: {
          ownerName: values.ownerName,
          repositoryName: values.repositoryName,
          rating: Number(values.rating),
          text: values.text,
        },
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={{
              ownerName: '',
              repositoryName: '',
              rating: '',
              text: '',
            }}
            validationSchema={validationSchema}
            onSubmit={submit}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Repository owner name"
                  placeholderTextColor="#888"
                  value={values.ownerName}
                  onChangeText={handleChange('ownerName')}
                />
                {touched.ownerName && errors.ownerName && (
                  <Text style={styles.error}>{errors.ownerName}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Repository name"
                  placeholderTextColor="#888"
                  value={values.repositoryName}
                  onChangeText={handleChange('repositoryName')}
                />
                {touched.repositoryName && errors.repositoryName && (
                  <Text style={styles.error}>{errors.repositoryName}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Rating (0–100)"
                  placeholderTextColor="#888"
                  value={values.rating}
                  onChangeText={handleChange('rating')}
                  keyboardType="numeric"
                />
                {touched.rating && errors.rating && (
                  <Text style={styles.error}>{errors.rating}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Review text (optional)"
                  placeholderTextColor="#888"
                  value={values.text}
                  onChangeText={handleChange('text')}
                  multiline
                />

                <Button
                  title="Create a review"
                  onPress={handleSubmit as any}
                  disabled={!isValid}
                />
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default CreateReviewScreen;
