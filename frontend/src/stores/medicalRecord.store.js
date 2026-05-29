import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as medicalRecordAPI from '@/api/diagnosis.api';

export const useMedicalRecordStore = defineStore('medicalRecord', () => {
  const medicalRecords = ref([]);
  const selectedRecord = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const getMedicalRecords = computed(() => medicalRecords.value);
  const getSelectedRecord = computed(() => selectedRecord.value);

  const fetchMedicalRecords = async (patientId, page = 1, limit = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await medicalRecordAPI.getPatientDiagnosis(patientId, page, limit);
      medicalRecords.value = response.data?.records || response.data || [];
    } catch (err) {
      error.value = err.message;
      console.error('Medical records fetch error:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchRecordById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await medicalRecordAPI.getDiagnosisById(id);
      selectedRecord.value = response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Medical record fetch error:', err);
    } finally {
      loading.value = false;
    }
  };

  const createRecord = async (recordData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await medicalRecordAPI.createDiagnosis(recordData);
      medicalRecords.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Medical record create error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateRecord = async (id, recordData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await medicalRecordAPI.updateDiagnosis(id, recordData);
      const index = medicalRecords.value.findIndex(r => r._id === id);
      if (index > -1) {
        medicalRecords.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Medical record update error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    medicalRecords.value = [];
    selectedRecord.value = null;
    error.value = null;
  };

  return {
    medicalRecords,
    selectedRecord,
    loading,
    error,
    getMedicalRecords,
    getSelectedRecord,
    fetchMedicalRecords,
    fetchRecordById,
    createRecord,
    updateRecord,
    reset
  };
});
