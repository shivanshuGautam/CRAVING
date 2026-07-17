import React, { useState } from "react";
import {
  MdInfoOutline,
  MdPhotoCamera,
  MdStorefront,
  MdToggleOff,
  MdToggleOn,
  MdTune,
} from "react-icons/md";
import RestaurantInformation from "./settings/RestaurantInformation";
import ResturantCoreDetails from "./settings/ResturantCoreDetails";
import RestaurantPhotos from "./settings/RestaurantPhotos";

const RestaurantSetting = () => {
  const Tabs = [
    { id: "information", label: "Information", icon: MdInfoOutline },
    { id: "coreDetails", label: "Core Details", icon: MdTune },
    { id: "photos", label: "Photos", icon: MdPhotoCamera },
  ];
  const [activeTab, setActiveTab] = useState("coreDetails");
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);

  const renderTabContent = () => {
    if (activeTab === "information") return <RestaurantInformation />;
    if (activeTab === "photos") return <RestaurantPhotos />;
    return <ResturantCoreDetails />;
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="rounded-[24px] border border-orange-200/70 bg-gradient-to-br from-[#fff8f1] via-[#fff3e8] to-[#ffe9d8] p-4 shadow-[0_16px_40px_rgba(194,65,12,0.12)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-(--color-primary) p-3 text-white shadow-lg shadow-orange-200">
              <MdStorefront className="text-2xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#7c2d12]">
                Restaurant Settings
              </h2>
              <p className="text-sm text-[#8a5a3b]">
                Shape your storefront like a premium food brand and keep every detail customer-ready.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-orange-200 bg-white/80 px-3 py-2 shadow-sm">
            <span
              className={`text-sm font-semibold ${isRestaurantOpen ? "text-emerald-600" : "text-rose-600"}`}
            >
              {isRestaurantOpen ? "Open Now" : "Currently Closed"}
            </span>
            <button
              type="button"
              onClick={() => setIsRestaurantOpen(!isRestaurantOpen)}
              className="focus:outline-none"
              aria-label="Toggle restaurant open state"
            >
              {isRestaurantOpen ? (
                <MdToggleOn className="text-3xl text-(--color-primary)" />
              ) : (
                <MdToggleOff className="text-3xl text-(--color-secondary)" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border-(--color-primary) bg-(--color-primary) text-white shadow-md"
                    : "border-orange-200 bg-white/80 text-[#8a5a3b] hover:border-(--color-primary)/50 hover:text-(--color-primary)"
                }`}
              >
                <Icon className="text-base" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-[24px] border border-orange-200/70 bg-[#fff7ef] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="h-full overflow-y-auto rounded-[20px] bg-white p-3 md:p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default RestaurantSetting;