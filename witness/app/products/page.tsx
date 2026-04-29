"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import type { SettingKey } from "@/lib/site-settings";
import { PLATFORM_LABELS, type FollowPlatform } from "@/lib/creator-follow";
import { productCatalog } from "@/lib/product-catalog";

const filters = ["All", "Official", "Creator Profiles", "Rights Acquired"] as const;
type FilterOption = (typeof filters)[number];
type ProductSize = "S" | "M" | "L" | "XL" | "XXL";
type ProductColor = "Black" | "White" | "Emerald" | "Charcoal";
type CreatorCard = {
  screenName: string;
  displayName: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  backgroundUrl: string;
  followLinks: Partial<Record<FollowPlatform, string>>;
  createdAt: string | null;
  isNew?: boolean;
};
type CreatorDiscoveryTab = "All Creators" | "Creator Info" | "Trending Creators" | "New Creators";

const SIZE_ADJUSTMENTS: Record<ProductSize, number> = {
  S: 0,
  M: 0,
  L: 1,
  XL: 2,
  XXL: 3,
};

const COLOR_ADJUSTMENTS: Record<ProductColor, number> = {
  Black: 0,
  White: 0,
  Emerald: 1,
  Charcoal: 1,
};
const creatorDiscoveryTabs: CreatorDiscoveryTab[] = [
  "All Creators",
  "Creator Info",
  "Trending Creators",
  "New Creators",
];

export default function ProductsPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("All");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [creatorTab, setCreatorTab] = useState<CreatorDiscoveryTab>("All Creators");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, ProductSize>>({});
  const [selectedColors, setSelectedColors] = useState<Record<number, ProductColor>>({});
  const [lastAddedDesignId, setLastAddedDesignId] = useState<number | null>(null);
  const [creatorCards, setCreatorCards] = useState<CreatorCard[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);
  const [hiddenCreatorImages, setHiddenCreatorImages] = useState<Record<string, boolean>>({});
  const { items, addToCart, subtotal, itemCount } = useCart();
  const [ordersEnabled, setOrdersEnabled] = useState(true);
  const [submissionsEnabled, setSubmissionsEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/settings/public", { cache: "no-store" });
        const result = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          settings?: Partial<Record<SettingKey, boolean>>;
        };
        if (!cancelled && response.ok && result.ok) {
          const settings = result.settings ?? {};
          setOrdersEnabled(settings.orders_enabled !== false);
          setSubmissionsEnabled(settings.new_design_submissions_enabled !== false);
          setMaintenanceMode(settings.site_maintenance_mode === true);
        }
      } catch {
        if (!cancelled) {
          setOrdersEnabled(true);
          setSubmissionsEnabled(true);
          setMaintenanceMode(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/creators", { cache: "no-store" });
        const result = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          creators?: CreatorCard[];
        };
        if (!cancelled && response.ok && result.ok) {
          setCreatorCards(Array.isArray(result.creators) ? result.creators : []);
        }
      } catch {
        if (!cancelled) {
          setCreatorCards([]);
        }
      } finally {
        if (!cancelled) {
          setCreatorsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const approvedDesigns = useMemo(
    () => productCatalog.filter((design) => design.moderationStatus === "approved"),
    [],
  );

  const productCountByCreator = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const design of approvedDesigns) {
      counts[design.creator] = (counts[design.creator] ?? 0) + 1;
    }
    return counts;
  }, [approvedDesigns]);

  const visibleCreatorCards = useMemo(() => {
    const approvedCreatorNames = new Set(Object.keys(productCountByCreator));
    const apiCards = creatorCards.filter(
      (creator) => approvedCreatorNames.has(creator.screenName) || approvedCreatorNames.has(creator.displayName),
    );
    const base = apiCards.length
      ? apiCards
      : Array.from(approvedCreatorNames).map((name) => ({
          screenName: name,
          displayName: name,
          tagline: "",
          bio: "",
          avatarUrl: "",
          bannerUrl: "",
          backgroundUrl: "",
          followLinks: {},
          createdAt: null,
          isNew: false,
        }));

    return base.map((creator) => {
      const creatorKey = productCountByCreator[creator.screenName] ? creator.screenName : creator.displayName;
      return {
        ...creator,
        productCount: productCountByCreator[creatorKey] ?? 0,
        joinedLabel: creator.createdAt
          ? new Date(creator.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" })
          : null,
      };
    });
  }, [creatorCards, productCountByCreator]);

  const selectedCreatorCard = useMemo(() => {
    if (selectedCreator !== "all") {
      return visibleCreatorCards.find((creator) => creator.screenName === selectedCreator) ?? null;
    }
    return visibleCreatorCards[0] ?? null;
  }, [selectedCreator, visibleCreatorCards]);

  const newCreators = useMemo(
    () =>
      visibleCreatorCards
        .filter((creator) => creator.isNew)
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()),
    [visibleCreatorCards],
  );

  const filteredDesigns = useMemo(() => {
    if (selectedFilter === "All") return approvedDesigns;
    if (selectedFilter === "Official") {
      return approvedDesigns.filter((design) => design.contentType === "official");
    }
    if (selectedFilter === "Creator Profiles") {
      const effectiveCreator =
        selectedCreator === "all" && creatorTab === "Creator Info" ? (selectedCreatorCard?.screenName ?? "all") : selectedCreator;
      if (effectiveCreator === "all") return approvedDesigns;
      const activeCreator = visibleCreatorCards.find((creator) => creator.screenName === effectiveCreator);
      if (!activeCreator) return approvedDesigns;
      return approvedDesigns.filter(
        (design) => design.creator === activeCreator.screenName || design.creator === activeCreator.displayName,
      );
    }
    return approvedDesigns.filter(
      (design) =>
        design.contentType === "user-submitted" &&
        design.agreementType === "One-Time",
    );
  }, [approvedDesigns, creatorTab, selectedCreator, selectedCreatorCard, selectedFilter, visibleCreatorCards]);

  const getSelectedSize = (designId: number): ProductSize => selectedSizes[designId] ?? "M";
  const getSelectedColor = (designId: number): ProductColor => selectedColors[designId] ?? "Black";
  const showDesignGrid =
    selectedFilter !== "Creator Profiles" || creatorTab === "All Creators" || creatorTab === "Creator Info";

  const getVariantPrice = (fromPrice: number, size: ProductSize, color: ProductColor) =>
    fromPrice + SIZE_ADJUSTMENTS[size] + COLOR_ADJUSTMENTS[color];

  const handleAddToCart = (designId: number) => {
    if (!ordersEnabled || maintenanceMode) return;
    const design = filteredDesigns.find((item) => item.id === designId);
    if (!design) return;
    const size = getSelectedSize(designId);
    const color = getSelectedColor(designId);
    const price = getVariantPrice(design.fromPrice, size, color);
    addToCart({
      designId: design.id,
      name: design.name,
      imagePath: design.imagePath,
      size,
      color,
      price,
    });
    setLastAddedDesignId(design.id);
    window.setTimeout(() => setLastAddedDesignId((prev) => (prev === design.id ? null : prev)), 1600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:gap-10 sm:px-8 sm:py-16 lg:px-16">
        {maintenanceMode && (
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-semibold text-amber-200">
              Site maintenance mode is active. Purchases and submissions are temporarily unavailable.
            </p>
          </section>
        )}
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-12">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Products
          </p>
          <h1 className="text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">Browse Designs</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-lg sm:leading-7">
            Pick a design to create your custom product.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(filter);
                    if (filter === "Creator Profiles") {
                      setCreatorTab("All Creators");
                      setSelectedCreator("all");
                    }
                  }}
                  className={
                    filter === selectedFilter
                      ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300"
                      : "rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>

            {(selectedFilter === "All" || selectedFilter === "Official") && (
              <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Official Witness Catalog</p>
                <p className="mt-1 text-sm text-zinc-300">
                  These are official Witness designs, including in-house drops and designs where rights were purchased from creators.
                </p>
              </div>
            )}
            {selectedFilter === "Creator Profiles" && (
              <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Creator Profiles</p>
                <p className="mt-1 text-sm text-zinc-300">
                  Discover creators, follow their work, and browse the designs connected to each profile.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {creatorDiscoveryTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCreatorTab(tab)}
                      className={
                        tab === creatorTab
                          ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                          : "rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                      }
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {creatorTab === "All Creators" && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleCreatorCards.map((creator) => {
                      const creatorBadgeKey = creator.screenName || creator.displayName;
                      const cardBanner = hiddenCreatorImages[`${creatorBadgeKey}:banner`]
                        ? ""
                        : creator.bannerUrl || creator.backgroundUrl;
                      return (
                        <article
                          key={creator.screenName}
                          className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/70"
                        >
                          <div className="relative h-20 border-b border-zinc-700 bg-zinc-900">
                            {cardBanner ? (
                              <>
                                <Image
                                  src={cardBanner}
                                  alt={`${creator.displayName} header`}
                                  fill
                                  sizes="(max-width: 640px) 100vw, 33vw"
                                  className="object-cover"
                                  onError={() =>
                                    setHiddenCreatorImages((prev) => ({ ...prev, [`${creatorBadgeKey}:banner`]: true }))
                                  }
                                />
                                <div className="absolute inset-0 bg-zinc-950/45" />
                              </>
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-800" />
                            )}
                          </div>
                          <div className="p-3">
                            <div className="-mt-8 mb-2 flex items-center gap-3">
                              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
                                {creator.avatarUrl && !hiddenCreatorImages[`${creatorBadgeKey}:avatar`] ? (
                                  <Image
                                    src={creator.avatarUrl}
                                    alt={`${creator.displayName} avatar`}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                    onError={() =>
                                      setHiddenCreatorImages((prev) => ({ ...prev, [`${creatorBadgeKey}:avatar`]: true }))
                                    }
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase text-zinc-400">
                                    {creator.displayName.slice(0, 2)}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-zinc-100">{creator.displayName}</p>
                                <p className="truncate text-xs text-zinc-400">@{creator.screenName}</p>
                              </div>
                            </div>
                            <p className="line-clamp-2 text-xs text-zinc-300">
                              {creator.tagline || creator.bio || "Creator profile is live on Witness."}
                            </p>
                            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                              <span>{creator.productCount} design{creator.productCount === 1 ? "" : "s"}</span>
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                                Popular creator
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <Link
                                href={`/creators/${encodeURIComponent(creator.screenName)}`}
                                className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2 py-1.5 text-center text-xs font-semibold text-emerald-300"
                              >
                                View profile
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCreator(creator.screenName);
                                  setCreatorTab("Creator Info");
                                }}
                                className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-2 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                              >
                                Browse designs
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                    {!creatorsLoading && visibleCreatorCards.length === 0 && (
                      <p className="text-sm text-zinc-400">No creator profiles are available yet.</p>
                    )}
                  </div>
                )}

                {creatorTab === "Creator Info" && (
                  <div className="mt-4 space-y-3">
                    {selectedCreatorCard ? (
                      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/70">
                        <div className="relative h-36 border-b border-zinc-700 bg-zinc-900 sm:h-44">
                          {(selectedCreatorCard.bannerUrl || selectedCreatorCard.backgroundUrl) &&
                          !hiddenCreatorImages[`${selectedCreatorCard.screenName}:spotlight`] ? (
                            <>
                              <Image
                                src={selectedCreatorCard.bannerUrl || selectedCreatorCard.backgroundUrl}
                                alt={`${selectedCreatorCard.displayName} spotlight`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 70vw"
                                onError={() =>
                                  setHiddenCreatorImages((prev) => ({
                                    ...prev,
                                    [`${selectedCreatorCard.screenName}:spotlight`]: true,
                                  }))
                                }
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/45 to-zinc-900/20" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-800" />
                          )}
                          <div className="absolute bottom-3 left-3 right-3 flex items-end gap-3">
                            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
                              {selectedCreatorCard.avatarUrl &&
                              !hiddenCreatorImages[`${selectedCreatorCard.screenName}:avatar`] ? (
                                <Image
                                  src={selectedCreatorCard.avatarUrl}
                                  alt={`${selectedCreatorCard.displayName} avatar`}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                  onError={() =>
                                    setHiddenCreatorImages((prev) => ({
                                      ...prev,
                                      [`${selectedCreatorCard.screenName}:avatar`]: true,
                                    }))
                                  }
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase text-zinc-400">
                                  {selectedCreatorCard.displayName.slice(0, 2)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-lg font-semibold text-zinc-100">{selectedCreatorCard.displayName}</p>
                              <p className="truncate text-xs text-zinc-300">@{selectedCreatorCard.screenName}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
                          <div>
                            <p className="text-sm font-semibold text-emerald-300">
                              {selectedCreatorCard.tagline || "Creator Spotlight"}
                            </p>
                            <p className="mt-1 text-sm text-zinc-300">
                              {selectedCreatorCard.bio || "This creator is building their public profile on Witness."}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(selectedCreatorCard.followLinks)
                                .filter(([, link]) => Boolean(link))
                                .slice(0, 4)
                                .map(([platform, link]) => (
                                  <a
                                    key={platform}
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-zinc-700 bg-zinc-900/70 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300"
                                  >
                                    {PLATFORM_LABELS[platform as FollowPlatform]}
                                  </a>
                                ))}
                            </div>
                          </div>
                          <div className="grid gap-2 sm:min-w-40">
                            <Link
                              href={`/creators/${encodeURIComponent(selectedCreatorCard.screenName)}`}
                              className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-center text-xs font-semibold text-emerald-300"
                            >
                              View full profile
                            </Link>
                            <button
                              type="button"
                              onClick={() => setSelectedCreator(selectedCreatorCard.screenName)}
                              className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                            >
                              Browse this creator&apos;s designs
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400">No creator spotlight available yet.</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCreator("all")}
                        className={
                          selectedCreator === "all"
                            ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                            : "rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                        }
                      >
                        All Creators
                      </button>
                      {visibleCreatorCards.map((creator) => (
                        <button
                          key={creator.screenName}
                          type="button"
                          onClick={() => setSelectedCreator(creator.screenName)}
                          className={
                            selectedCreator === creator.screenName
                              ? "rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300"
                              : "rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                          }
                        >
                          {creator.displayName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {creatorTab === "Trending Creators" && (
                  <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
                    <p className="text-sm font-semibold text-zinc-100">Trending creators</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Ranked by recent order activity from the last 7 days.
                    </p>
                    <p className="mt-3 text-sm text-zinc-400">No trending creators yet.</p>
                  </div>
                )}

                {creatorTab === "New Creators" && (
                  <div className="mt-4">
                    {newCreators.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {newCreators.map((creator) => (
                          <article key={creator.screenName} className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-3">
                            <p className="text-sm font-semibold text-zinc-100">{creator.displayName}</p>
                            <p className="text-xs text-zinc-400">@{creator.screenName}</p>
                            <p className="mt-2 text-xs text-zinc-300">
                              {creator.tagline || creator.bio || "New creator on Witness."}
                            </p>
                            <div className="mt-3 flex items-center justify-between text-[11px]">
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                                New creator
                              </span>
                              <span className="text-zinc-400">Joined {creator.joinedLabel ?? "recently"}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4 text-sm text-zinc-400">
                        No new creators yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {showDesignGrid &&
              (filteredDesigns.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredDesigns.map((design) => (
                  <article
                    key={design.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-sm transition-colors hover:border-emerald-500/50"
                  >
                    <div className="relative h-40 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                      <div className="absolute inset-x-0 top-0 h-16 bg-emerald-500/10 blur-2xl" />
                      <Image
                        src={design.imagePath}
                        alt={design.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>

                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-400">{design.category}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full border border-zinc-700 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
                        {design.contentType === "official" ? "Official" : "User Submitted"}
                      </span>
                      {design.moderationStatus === "approved" && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                          Approved
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-zinc-100">{design.name}</h2>

                    <div className="mt-3 space-y-1 text-sm text-zinc-300">
                      <p>
                        Base price: <span className="font-semibold text-zinc-100">${design.basePrice.toFixed(2)}</span>
                      </p>
                      <p>
                        From <span className="font-semibold text-emerald-300">${design.fromPrice.toFixed(2)}</span>
                      </p>
                      <p className="text-zinc-400">Creator: {design.creator}</p>
                      {design.agreementType && (
                        <p className="text-zinc-400">
                          Agreement: {design.agreementType}
                          {design.royaltyPercent ? ` (${design.royaltyPercent}% royalty)` : ""}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <label className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Size</span>
                          <div className="relative">
                          <select
                            value={getSelectedSize(design.id)}
                            onChange={(e) =>
                              setSelectedSizes((prev) => ({ ...prev, [design.id]: e.target.value as ProductSize }))
                            }
                            className="mobile-touch-target w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 pr-8 text-xs text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                          >
                            {Object.keys(SIZE_ADJUSTMENTS).map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
                              ▼
                            </span>
                          </div>
                        </label>
                        <label className="grid gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Color</span>
                          <div className="relative">
                          <select
                            value={getSelectedColor(design.id)}
                            onChange={(e) =>
                              setSelectedColors((prev) => ({
                                ...prev,
                                [design.id]: e.target.value as ProductColor,
                              }))
                            }
                            className="mobile-touch-target w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 pr-8 text-xs text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
                          >
                            {Object.keys(COLOR_ADJUSTMENTS).map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400">
                              ▼
                            </span>
                          </div>
                        </label>
                      </div>

                      <p className="text-xs text-zinc-400">
                        Variant price:{" "}
                        <span className="font-semibold text-emerald-300">
                          $
                          {getVariantPrice(
                            design.fromPrice,
                            getSelectedSize(design.id),
                            getSelectedColor(design.id),
                          ).toFixed(2)}
                        </span>
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(design.id)}
                          disabled={!ordersEnabled || maintenanceMode}
                          className={`mobile-touch-target rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                            lastAddedDesignId === design.id
                              ? "scale-[1.02] border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                              : "border-zinc-700 bg-zinc-900/70 text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-300"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {!ordersEnabled || maintenanceMode
                            ? "Unavailable"
                            : lastAddedDesignId === design.id
                              ? "Added!"
                              : "Add to Cart"}
                        </button>
                        <Link
                          href="/cart"
                          className="mobile-touch-target rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-center text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                        >
                          View Cart
                        </Link>
                      </div>
                      {lastAddedDesignId === design.id && (
                        <p className="text-xs font-semibold text-emerald-300">Added to cart!</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8">
                <p className="text-lg font-semibold text-emerald-300">{selectedFilter}</p>
                {selectedFilter === "Creator Profiles" ? (
                  <>
                    <p className="mt-2 text-sm text-zinc-300">
                      No approved designs are available for this creator yet.
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Creator profile matching appears here once their designs are approved.
                    </p>
                  </>
                ) : selectedFilter === "Rights Acquired" ? (
                  <p className="mt-2 text-sm text-zinc-300">
                    No rights-acquired products are live yet.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-zinc-300">
                    No products are live in this section yet.
                  </p>
                )}
                <Link
                  href="/submit-design"
                  aria-disabled={!submissionsEnabled || maintenanceMode}
                  className={`mobile-touch-target mt-4 inline-flex w-full rounded-xl border px-4 py-2 text-center text-sm font-semibold transition-colors sm:w-auto ${
                    submissionsEnabled && !maintenanceMode
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 transition-colors hover:bg-emerald-500/25"
                      : "pointer-events-none border-zinc-700 bg-zinc-900/70 text-zinc-500"
                  }`}
                >
                  {submissionsEnabled && !maintenanceMode ? "Submit Design" : "Submissions Unavailable"}
                </Link>
                {(selectedFilter === "Creator Profiles" || selectedFilter === "Rights Acquired") && (
                  <Link
                    href="/submit-design"
                    aria-disabled={!submissionsEnabled || maintenanceMode}
                    className={`mobile-touch-target mt-3 inline-flex w-full rounded-xl border px-4 py-2 text-center text-sm font-semibold sm:ml-3 sm:mt-0 sm:w-auto ${
                      submissionsEnabled && !maintenanceMode
                        ? "border-zinc-700 bg-zinc-900/70 text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                        : "pointer-events-none border-zinc-700 bg-zinc-900/70 text-zinc-500"
                    }`}
                  >
                    {submissionsEnabled && !maintenanceMode ? "Be first to submit" : "Submissions Unavailable"}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <aside className="h-fit space-y-4">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <h3 className="text-xl font-semibold text-emerald-300">Cart</h3>
              <p className="mt-2 text-sm text-zinc-300">
                {itemCount === 0
                  ? "Your cart is empty. Add a design to start checkout."
                  : `${itemCount} item${itemCount === 1 ? "" : "s"} in cart`}
              </p>
              {items.length > 0 && (
                <div className="mt-4 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-lg border border-zinc-700 bg-zinc-950/70 p-2">
                      <p className="text-xs font-semibold text-zinc-100">{item.name}</p>
                      <p className="text-[11px] text-zinc-400">
                        {item.size} · {item.color} · Qty {item.quantity}
                      </p>
                      <p className="text-xs font-semibold text-emerald-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <p className="pt-1 text-sm text-zinc-300">
                    Subtotal: <span className="font-semibold text-zinc-100">${subtotal.toFixed(2)}</span>
                  </p>
                  <Link
                    href="/cart"
                    className="mt-1 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
                  >
                    Go to Cart
                  </Link>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <h3 className="text-xl font-semibold text-emerald-300">How It Works</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-300">
                See exactly how each product price is built, from base production cost to operating margin and creator royalties.
              </p>
              <Link
                href="/how-it-works"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25"
              >
                View Pricing Breakdown
              </Link>
              <Link
                href="/submit-design"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
              >
                Submit a Design
              </Link>
              <p className="mt-4 text-xs text-zinc-400">
                Choosing a design here is step one. Product options and customization can be selected next.
              </p>
            </section>
          </aside>
        </section>

        {itemCount > 0 && (
          <section className="fixed bottom-3 left-3 right-3 z-40 rounded-xl border border-emerald-500/30 bg-zinc-950/95 p-3 shadow-2xl shadow-emerald-500/10 md:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-300">
                <span className="font-semibold text-emerald-300">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>{" "}
                · ${subtotal.toFixed(2)}
              </p>
              <Link
                href="/cart"
                className="mobile-touch-target inline-flex items-center rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300"
              >
                View Cart
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
