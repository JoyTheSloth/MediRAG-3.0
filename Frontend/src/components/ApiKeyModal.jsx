import React, { useState } from 'react';
import './ApiKeyModal.css';

const ApiKeyModal = ({ isOpen, onClose, onSave, defaultProvider = 'Mistral' }) => {
    const [key, setKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!key.trim()) {
            setError('API Key cannot be empty.');
            return;
        }
        setIsValidating(true);
        setError('');

        try {
            let res;
            if (defaultProvider === 'Mistral') {
                res = await fetch('https://api.mistral.ai/v1/models', {
                    headers: { 'Authorization': `Bearer ${key}` }
                });
            } else if (defaultProvider === 'Groq') {
                res = await fetch('https://api.groq.com/openai/v1/models', {
                    headers: { 'Authorization': `Bearer ${key}` }
                });
            } else if (defaultProvider === 'OpenAI') {
                res = await fetch('https://api.openai.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${key}` }
                });
            } else {
                // If it's Gemini/other without a standard quick check endpoint, just accept it
                onSave(key);
                setIsValidating(false);
                return;
            }

            if (!res.ok) {
                throw new Error(`Invalid ${defaultProvider} API Key (Status ${res.status}).`);
            }
            
            setKey('');
            onSave(key);
        } catch (e) {
            setError(e.message || 'Validation failed. Check your network or key.');
        } finally {
            setIsValidating(false);
        }
    };

    return (
        <div className="api-modal-overlay">
            <div className="api-modal-box">
                <div className="api-modal-header">
                    <span className="api-modal-icon">🔐</span>
                    <h3>Authentication Required</h3>
                </div>
                <p className="api-modal-desc">
                    You must provide your <strong>{defaultProvider}</strong> API Key to run this query. The key is never stored on our servers and is only used temporarily in your browser session.
                </p>
                <div className="api-modal-input-group">
                    <input 
                        type="password" 
                        value={key} 
                        onChange={e => setKey(e.target.value)} 
                        placeholder={`Enter ${defaultProvider} API Key (e.g. sk-...)`} 
                        className={`api-modal-input ${error ? 'error' : ''}`}
                    />
                </div>
                {error && <div className="api-modal-err-msg">❌ {error}</div>}
                <div className="api-modal-actions">
                    <button className="api-btn-cancel" onClick={onClose} disabled={isValidating}>Cancel</button>
                    <button className="api-btn-save" onClick={handleSave} disabled={isValidating}>
                        {isValidating ? 'Validating...' : 'Validate & Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
