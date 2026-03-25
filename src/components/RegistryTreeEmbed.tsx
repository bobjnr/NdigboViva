'use client';

import { useState } from 'react';
import { ExternalLink, TreePine, AlertCircle } from 'lucide-react';

interface RegistryTreeEmbedProps {
  /** Full URL to the person page on Gramps Web (or other registry). */
  registryUrl: string;
  /** Optional label for the registry (e.g. "Official registry"). */
  registryLabel?: string;
  /** Height of the iframe in pixels. */
  height?: number;
}

/**
 * Embeds the registry (e.g. Gramps Web) person page in an iframe so the
 * family tree can be viewed on our site. Many registry UIs show the tree
 * on the person page. If the registry blocks embedding (X-Frame-Options),
 * the iframe may be blank; we show a fallback link to open in a new tab.
 */
export default function RegistryTreeEmbed({
  registryUrl,
  registryLabel = 'official registry',
  height = 560,
}: RegistryTreeEmbedProps) {
  const [iframeFailed, setIframeFailed] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-amber-50 border-b border-amber-100">
        <span className="text-sm font-medium text-amber-900 flex items-center gap-2">
          <TreePine className="w-4 h-4" />
          Family tree in {registryLabel}
        </span>
        <a
          href={registryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
        >
          Open in new tab
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <div className="relative" style={{ minHeight: height }}>
        <iframe
          src={registryUrl}
          title={`Family tree in ${registryLabel}`}
          className="w-full border-0"
          style={{ height: `${height}px` }}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onError={() => setIframeFailed(true)}
        />
        {iframeFailed && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100/95 p-4 text-center"
            style={{ minHeight: height }}
          >
            <AlertCircle className="w-10 h-10 text-amber-600" />
            <p className="text-sm text-gray-700">
              The registry could not be embedded. Use the button above to open it in a new tab.
            </p>
            <a
              href={registryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
            >
              Open in new tab
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
      <p className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
        If the tree does not appear, the registry may block embedding. Use &quot;Open in new tab&quot; to view it there.
      </p>
    </div>
  );
}
