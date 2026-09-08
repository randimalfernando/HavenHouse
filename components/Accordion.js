"use client";

import { useState } from "react";

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div className="accordion-item" key={item.id}>
            <h3 style={{ margin: 0 }}>
              <button
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                id={`trigger-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                <span aria-hidden="true">{isOpen ? "–" : "+"}</span>
              </button>
            </h3>
            {isOpen && (
              <div
                className="accordion-panel"
                id={`panel-${item.id}`}
                role="region"
                aria-labelledby={`trigger-${item.id}`}
              >
                <p style={{ margin: 0 }}>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
