'use client';

import { useState } from 'react';

interface DescriptionRendererProps {
    text: string;
    className?: string;
    /** Number of bullet/text tokens to show before "Read more". Default: 6 */
    collapseAfter?: number;
}

type Token =
    | { type: 'header'; content: string }
    | { type: 'bullet'; content: string }
    | { type: 'text'; content: string }
    | { type: 'spacer' };

/**
 * Parses a plain-text description into structured tokens.
 * Handles two formats:
 *   1. Newline-based: each line is a separate item
 *   2. Inline bullets: "intro text 🏠 Section: • item1 • item2 🍴 Next Section: • item3"
 */
function parseDescription(text: string): Token[] {
    const tokens: Token[] = [];

    // --- Format 1: Has real newlines ---
    if (text.includes('\n')) {
        for (const line of text.split('\n')) {
            const t = line.trim();
            if (!t) { tokens.push({ type: 'spacer' }); continue; }
            if (t.endsWith(':')) { tokens.push({ type: 'header', content: t }); continue; }
            if (t.startsWith('•') || t.startsWith('-')) {
                tokens.push({ type: 'bullet', content: t.replace(/^[•\-]\s*/, '') });
                continue;
            }
            tokens.push({ type: 'text', content: t });
        }
        return tokens;
    }

    // --- Format 2: All inline, bullets separated by "•" ---
    const segments = text.split(/\s*•\s*/);

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i].trim();
        if (!seg) continue;

        if (seg.endsWith(':')) {
            // Segment ends with a header — may contain a previous bullet item before the header
            // e.g. "previous item content 🛋 Furnishings & Comfort:"
            const emojiHeaderMatch = seg.match(/^([\s\S]+?)\s+([\p{Emoji_Presentation}\p{So}][^:]+:)$/u);
            if (emojiHeaderMatch && i > 0) {
                // Push the bullet content before the header
                tokens.push({ type: 'bullet', content: emojiHeaderMatch[1].trim() });
                tokens.push({ type: 'header', content: emojiHeaderMatch[2].trim() });
            } else {
                tokens.push({ type: 'header', content: seg });
            }
        } else if (i === 0) {
            // First segment (before any bullet) — may be intro text + embedded section header
            // e.g. "2BHK House for Rent 🏠 Highlights:"  ← but this would end with ":" and be caught above
            // Or just plain intro text
            tokens.push({ type: 'text', content: seg });
        } else {
            tokens.push({ type: 'bullet', content: seg });
        }
    }

    return tokens;
}

export default function DescriptionRenderer({
    text,
    className = '',
    collapseAfter = 6,
}: DescriptionRendererProps) {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    const tokens = parseDescription(text);

    // Count only visible content tokens (not spacers or headers) for collapse threshold
    let contentCount = 0;
    let collapseAt = tokens.length; // default: show all

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'bullet' || tokens[i].type === 'text') {
            contentCount++;
            if (contentCount === collapseAfter && !expanded) {
                collapseAt = i + 1;
                break;
            }
        }
    }

    const hasMore = collapseAt < tokens.length;
    const visibleTokens = expanded || !hasMore ? tokens : tokens.slice(0, collapseAt);

    return (
        <div className={`space-y-0.5 ${className}`}>
            {visibleTokens.map((token, index) => {
                if (token.type === 'spacer') {
                    return <div key={index} className="h-2" />;
                }

                if (token.type === 'header') {
                    return (
                        <p key={index} className="font-semibold text-gray-900 mt-3 mb-1 text-sm sm:text-base">
                            {token.content}
                        </p>
                    );
                }

                if (token.type === 'bullet') {
                    return (
                        <div key={index} className="flex items-start gap-2 pl-1 py-0.5">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
                            <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                {token.content}
                            </span>
                        </div>
                    );
                }

                // type === 'text'
                return (
                    <p key={index} className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {token.content}
                    </p>
                );
            })}

            {hasMore && (
                <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-2 text-sm font-medium text-brand-red hover:underline focus:outline-none"
                >
                    {expanded ? '▲ Show less' : `▼ Read more`}
                </button>
            )}
        </div>
    );
}
