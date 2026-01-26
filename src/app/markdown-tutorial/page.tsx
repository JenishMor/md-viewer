import { Metadata } from 'next';
import { Layout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Complete Markdown Tutorial | Learn Markdown Syntax | MDViewer',
  description: 'Master Markdown syntax with our comprehensive tutorial. Learn headers, lists, tables, and GitHub Flavored Markdown (GFM) with real-time examples.',
};

export default function MarkdownTutorial() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        <header className="space-y-4 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">The Complete Markdown Tutorial</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. Created by John Gruber in 2004, Markdown is now one of the world's most popular markup languages.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Why Learn Markdown?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Using Markdown is different from using a WYSIWYG editor. In an application like Microsoft Word, you click buttons to format words and phrases, and the changes are visible immediately. Markdown isn't like that. When you create a Markdown-formatted file, you add Markdown syntax to the text to indicate which words and phrases should look different.
          </p>
          <ul className="grid md:grid-cols-2 gap-4">
            <li className="p-4 bg-muted rounded-xl border"><strong>Portability:</strong> Markdown files can be opened in almost any application.</li>
            <li className="p-4 bg-muted rounded-xl border"><strong>Platform Independence:</strong> You can create Markdown-formatted text on any device running any operating system.</li>
            <li className="p-4 bg-muted rounded-xl border"><strong>Future Proof:</strong> Even if the application you’re using stops working in the future, you’ll still be able to read your Markdown-formatted text.</li>
            <li className="p-4 bg-muted rounded-xl border"><strong>Universality:</strong> Markdown is used heavily by platforms like GitHub, Reddit, and Stack Overflow.</li>
          </ul>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-bold">Basic Syntax Guide</h2>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">1. Headings</h3>
              <p className="text-muted-foreground">To create a heading, add number signs (#) in front of a word or phrase. The number of number signs you use should correspond to the heading level.</p>
              <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded-xl font-mono text-sm border border-slate-200 dark:border-slate-800 shadow-sm">
                # Heading Level 1<br/>
                ## Heading Level 2<br/>
                ### Heading Level 3
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">2. Paragraphs</h3>
              <p className="text-muted-foreground">To create paragraphs, use a blank line to separate one or more lines of text.</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">3. Emphasis</h3>
              <p className="text-muted-foreground">You can add emphasis by making text bold or italic.</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 border rounded-xl bg-card">
                  <div className="font-bold mb-2">Bold</div>
                  <code className="bg-muted px-1">**bold text**</code>
                </div>
                <div className="p-4 border rounded-xl bg-card">
                  <div className="font-bold mb-2">Italic</div>
                  <code className="bg-muted px-1">*italicized text*</code>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">4. Blockquotes</h3>
              <p className="text-muted-foreground">To create a blockquote, add a &gt; in front of a paragraph.</p>
              <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded-xl font-mono text-sm border border-slate-200 dark:border-slate-800 shadow-sm">
                &gt; Dorothy followed her through many of the beautiful rooms in her castle.
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">5. Lists</h3>
              <p className="text-muted-foreground">You can organize items into ordered and unordered lists.</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 border rounded-xl bg-card">
                  <div className="font-bold mb-2">Unordered</div>
                  <code className="bg-muted block p-2 rounded">
                    - First item<br/>
                    - Second item<br/>
                    - Third item
                  </code>
                </div>
                <div className="p-4 border rounded-xl bg-card">
                  <div className="font-bold mb-2">Ordered</div>
                  <code className="bg-muted block p-2 rounded">
                    1. First item<br/>
                    2. Second item<br/>
                    3. Third item
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
            <h2 className="text-3xl font-bold">Extended Syntax (GFM)</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
                Extended syntax includes features that aren't part of the basic Markdown specification but are supported by most modern renders, including GitHub.
            </p>

            <div className="space-y-6">
                <div className="space-y-3">
                    <h3 className="text-2xl font-semibold">Tables</h3>
                    <p className="text-muted-foreground">To add a table, use three or more hyphens (---) to create each column’s header, and use pipes (|) to separate each column.</p>
                    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded-xl font-mono text-sm border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
                        | Syntax | Description |<br/>
                        | ----------- | ----------- |<br/>
                        | Header | Title |<br/>
                        | Paragraph | Text |
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-2xl font-semibold">Code Blocks</h3>
                    <p className="text-muted-foreground">Fenced code blocks allow you to create code blocks without indenting lines. They also support syntax highlighting if you specify the language.</p>
                    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded-xl font-mono text-sm border border-slate-200 dark:border-slate-800 shadow-sm">
                        ```js<br/>
                        console.log('Hello world');<br/>
                        ```
                    </div>
                </div>
            </div>
        </section>

        <footer className="bg-primary/5 p-8 rounded-3xl border border-primary/10 text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Practice?</h2>
            <p className="text-muted-foreground">Use our live editor to try out these syntax examples and see them rendered in real-time.</p>
            <a href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Open Editor
            </a>
        </footer>
      </div>
    </Layout>
  );
}
