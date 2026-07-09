import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import {
    popularSearches,
    recentSearches,
    helpCategories,
    searchableArticles,
} from "./helpData";

export default function HelpSearch() {
    const [query, setQuery] = useState("");

    const filteredArticles = useMemo(() => {
        if (!query.trim()) return [];

        return searchableArticles.filter((article) =>
            article.title.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl"
        >
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
                <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-rose-500/10 blur-3xl" />
            </div>

            <div className="relative p-6 md:p-8 lg:p-10">
                {/* Heading */}
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-500">
                            <Sparkles size={15} />
                            Search Knowledge Base
                        </div>

                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                            Find answers instantly
                        </h2>

                        <p className="mt-2 text-[var(--text-secondary)]">
                            Search thousands of help articles, guides and FAQs.
                        </p>
                    </div>
                </div>

                {/* Search Box */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-page)] p-3 md:flex-row md:items-center"
                >
                    <div className="flex flex-1 items-center">
                        <Search
                            className="ml-3 text-[var(--text-muted)]"
                            size={22}
                        />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search articles, topics or keywords..."
                            className="w-full bg-transparent px-4 py-3 text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                        />
                    </div>

                    <button className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-7 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        Search
                    </button>
                </motion.div>
                {query && (
                    <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-4">
                        {filteredArticles.length > 0 ? (
                            <div className="space-y-3">
                                {filteredArticles.map((article) => (
                                    <button
                                        key={article.id}
                                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-[var(--bg-page)]"
                                    >
                                        <div>
                                            <p className="font-medium text-[var(--text-primary)]">
                                                {article.title}
                                            </p>

                                            <span className="text-sm text-[var(--text-secondary)]">
                                                {article.category}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-[var(--text-secondary)]">
                                No articles found.
                            </div>
                        )}
                    </div>
                )}


                <div className="mt-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                        Recent Searches
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {recentSearches.map((item) => (
                            <button
                                key={item}
                                onClick={() => setQuery(item)}
                                className="rounded-full bg-orange-500/10 px-4 py-2 text-sm text-orange-500 transition hover:bg-orange-500 hover:text-white"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                        Browse by Category
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {helpCategories.map((category) => {
                            const Icon = category.icon;

                            return (
                                <button
                                    key={category.id}
                                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-5 py-2 transition hover:border-orange-500 hover:text-orange-500"
                                >
                                    <Icon size={16} />
                                    {category.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Popular Searches */}
                <div className="mt-8">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                        Popular Searches
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {popularSearches.map((item, index) => (
                            <motion.button
                                key={item}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.06,
                                }}
                                whileHover={{
                                    y: -3,
                                }}
                                className="rounded-full border border-[var(--border)] bg-[var(--bg-muted)] px-5 py-2 text-sm text-[var(--text-secondary)] transition-all duration-300 hover:border-orange-500 hover:text-orange-500"
                            >
                                {item}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-6"
                    >
                        <h4 className="text-3xl font-bold text-orange-500">450+</h4>

                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Help Articles
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-6"
                    >
                        <h4 className="text-3xl font-bold text-orange-500">24/7</h4>

                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Support Available
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-muted)] p-6"
                    >
                        <h4 className="text-3xl font-bold text-orange-500">&lt; 2 min</h4>

                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Average Response
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
