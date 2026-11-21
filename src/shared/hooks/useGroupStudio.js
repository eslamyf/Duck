import { useState, useMemo, useCallback } from 'react';
import { GROUP_TYPES, TIMES_OF_DAY } from '../../widgets/groups-page/sceneData.js';
import { DESTINATIONS } from '../../widgets/destinations/destinationsData.js';
import { buildWhatsAppUrl } from '../config/constants.js';

export function useGroupStudio({ t }) {
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  }, []);

  const [state, setState] = useState({
    type: 0,
    size: 20,
    act: 'kayak',
    loc: 0,
    time: 3, // Sunset by default
    date: defaultDate,
    org: '',
    nm: '',
    ph: '',
    notes: '',
    nt: '',
  });

  const [step, setStep] = useState(0); // 0 = details & stage, 1 = contact info
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [waUrl, setWaUrl] = useState('');
  const [errors, setErrors] = useState({});

  const setField = useCallback((key, value) => {
    setState((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'notes') updated.nt = value;
      if (key === 'nt') updated.notes = value;
      return updated;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next.general;
      return next;
    });
  }, []);

  const setSize = useCallback((val) => {
    const num = Math.max(20, Math.min(150, Math.round(Number(val)) || 20));
    setField('size', num);
  }, [setField]);

  const cycleTime = useCallback(() => {
    setState((prev) => ({
      ...prev,
      time: (prev.time + 1) % TIMES_OF_DAY.length,
    }));
  }, []);

  // Step 1 Validation
  const validateStep1 = useCallback(() => {
    const newErrors = {};
    const today = new Date().toISOString().slice(0, 10);
    if (!state.date || state.date < today) {
      newErrors.date = t('groupsPage.errorFutureDate');
      newErrors.general = t('groupsPage.errorFutureDate');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state.date, t]);

  // Step 2 Validation
  const validateStep2 = useCallback(() => {
    const newErrors = {};
    if (!state.org || state.org.trim().length < 2) {
      newErrors.org = t('groupsPage.errorOrgRequired');
    }
    if (!state.nm || state.nm.trim().length < 2) {
      newErrors.nm = t('groupsPage.errorNameRequired');
    }
    const cleanPhone = state.ph.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      newErrors.ph = t('groupsPage.errorPhoneRequired');
    }
    if (Number(state.size) < 20) {
      newErrors.size = t('groupsPage.minSizeError');
    }

    if (Object.keys(newErrors).length > 0) {
      newErrors.general = newErrors.size
        ? t('groupsPage.minSizeError')
        : t('groupsPage.errorCompleteFields');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state.org, state.nm, state.ph, state.size, t]);

  // Submit and build WhatsApp message
  const submitRequest = useCallback(() => {
    if (!validateStep2()) return false;

    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    const code = `GRP-${year}-${rand}`;
    setRefCode(code);

    const typeObj = GROUP_TYPES[state.type];
    const typeName = t(`groupsPage.types.${typeObj.i18nKey}`);
    const actName = t(`groupsPage.activities.${state.act}`);
    const destName = t(`destinations.items.${DESTINATIONS[state.loc].key}.name`);
    const timeName = t(`groupsPage.times.${TIMES_OF_DAY[state.time].i18nKey}`);

    const text = t('groupsPage.whatsappMessage', {
      ref: code,
      org: state.org.trim(),
      type: typeName,
      name: state.nm.trim(),
      phone: state.ph.trim(),
      size: state.size,
      act: actName,
      dest: destName,
      date: state.date,
      time: timeName,
      notes: (state.notes || state.nt).trim() ? `\n• ${t('groupsPage.notesLabel')}: ${(state.notes || state.nt).trim()}` : '',
    });

    const url = buildWhatsAppUrl(text);
    setWaUrl(url);
    setSubmitted(true);
    return { code, text, waUrl: url };
  }, [state, validateStep2, t]);

  return {
    state,
    step,
    setStep,
    submitted,
    setSubmitted,
    refCode,
    waUrl,
    errors,
    setField,
    setSize,
    cycleTime,
    validateStep1,
    validateStep2,
    submitRequest,
  };
}
