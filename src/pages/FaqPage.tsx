import React, { useState, useEffect } from "react";
import { faqApi, apiUtils } from "../api";
import "./FaqContact.css";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FaqCategory {
  category: string;
  faqs: { q: string; a: string; id: number }[];
}

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [faqData, setFaqData] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const token = apiUtils.getToken();
        const result = await faqApi.getAllFaqs(token || undefined);
        console.log('FAQ API Response:', result);
        
        // Transform API data to match component structure
        const apiFaqs = result.data || [];
        const groupedFaqs = groupFaqsByCategory(apiFaqs);
        setFaqData(groupedFaqs);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setError('Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Group FAQs by category
  const groupFaqsByCategory = (faqs: FaqItem[]): FaqCategory[] => {
    const grouped: { [key: string]: FaqItem[] } = {};
    
    faqs.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });

    return Object.keys(grouped).map(category => ({
      category,
      faqs: grouped[category].map(faq => ({
        id: faq.id,
        q: faq.question,
        a: faq.answer
      }))
    }));
  };

  const filteredFaqs = faqData.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.faqs.length > 0);

  const handleToggle = (catIdx: number, faqIdx: number) => {
    const key = `${catIdx}-${faqIdx}`;
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="faq-page">
        <div className="faq-hero-header">
          <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          <div className="faq-hero-subtitle">Find answers to common questions about shopping, referrals, rewards, and more.</div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '2rem',
          minHeight: '200px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p>Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faq-page">
        <div className="faq-hero-header">
          <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          <div className="faq-hero-subtitle">Find answers to common questions about shopping, referrals, rewards, and more.</div>
        </div>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          color: '#ef4444'
        }}>
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: '#7c3aed',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page">
      <div className="faq-hero-header">
        <h1 className="faq-hero-title">Frequently Asked Questions</h1>
        <div className="faq-hero-subtitle">Find answers to common questions about shopping, referrals, rewards, and more.</div>
      </div>
      <input
        className="faq-search"
        type="text"
        placeholder="Search FAQs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="faq-categories">
        {filteredFaqs.map((cat, catIdx) => (
          <div className="faq-category" key={cat.category}>
            <div className="faq-category-title">{cat.category}</div>
            <div className="faq-list">
              {cat.faqs.map((f, faqIdx) => {
                const key = `${catIdx}-${faqIdx}`;
                const isOpen = !!open[key];
                return (
                  <div className={`faq-accordion-item${isOpen ? ' open' : ''}`} key={key}>
                    <button
                      className="faq-question"
                      onClick={() => handleToggle(catIdx, faqIdx)}
                      aria-expanded={isOpen}
                    >
                      <span>{f.q}</span>
                      <span className="faq-arrow">{isOpen ? "▲" : "▼"}</span>
                    </button>
                    <div className="faq-answer-wrapper" style={{ maxHeight: isOpen ? 200 : 0 }}>
                      <div className="faq-answer">{f.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filteredFaqs.length === 0 && <div className="faq-no-results">No FAQs found for your search.</div>}
      </div>
    </div>
  );
}