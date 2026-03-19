import React from "react";
import {
  Plus,
  Trash2,
  Upload,
  ChevronLeft,
  Save,
  AlertCircle,
  Clock,
  MapPin,
  Tag,
} from "lucide-react";
import Header from "../../../components/layout/Header";
import Dropdown from "../../../components/common/Dropdown";
import { useTourForm } from "../hooks/useTourForm";

const EditTour: React.FC = () => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    itinerary,
    setItinerary,
    adultPrice,
    setAdultPrice,
    childrenPrice,
    setChildrenPrice,
    durationDays,
    setDurationDays,
    durationNights,
    setDurationNights,
    categoryId,
    setCategoryId,
    placeId,
    setPlaceId,
    schedules,
    existingImages,
    newPreviews,
    categories,
    places,
    loading,
    initialLoading,
    error,
    success,
    handleImageChange,
    removeExistingImage,
    removeNewImage,
    addSchedule,
    updateSchedule,
    removeSchedule,
    handleSubmit,
    navigate,
  } = useTourForm("edit");

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
          <Save size={40} />
        </div>
        <h2 className="text-3xl font-black mb-2">Tour Updated!</h2>
        <p className="text-gray-500">Redirecting to management page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-bold"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Edit <span className="text-primary">Tour</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Update your tour details and departure dates
            </p>
          </div>
          <button
            form="edit-tour-form"
            type="submit"
            disabled={loading}
            className="btn-primary py-4 px-10 shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            <Save size={20} /> {loading ? "Updating..." : "Update Tour"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-6 rounded-3xl mb-10 flex items-center gap-4 border border-red-100">
            <AlertCircle className="shrink-0" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <form
          id="edit-tour-form"
          onSubmit={(e) => handleSubmit(e)}
          className="space-y-10"
        >
          {/* Basic Info */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                1
              </span>
              Basic Information
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Tour Title
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary/20 text-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Dropdown
                  label="Category"
                  options={categories}
                  value={categoryId}
                  onChange={(val) => setCategoryId(val)}
                  icon={<Tag size={20} />}
                  placeholder="Select Category"
                />
                <Dropdown
                  label="Main Location"
                  options={places}
                  value={placeId}
                  onChange={(val) => setPlaceId(val)}
                  icon={<MapPin size={20} />}
                  placeholder="Select Location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary/20 text-lg"
                />
              </div>
            </div>
          </section>

          {/* Pricing & Duration */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-cta/10 text-cta flex items-center justify-center">
                2
              </span>
              Pricing & Duration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Adult Price (VND)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={adultPrice}
                  onChange={(e) => setAdultPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary/20 text-xl font-black text-cta"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Children Price (VND)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={childrenPrice}
                  onChange={(e) => setChildrenPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary/20 text-xl font-black text-cta"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Days
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400">
                  Nights
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={durationNights}
                  onChange={(e) => setDurationNights(Number(e.target.value))}
                  className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>
            </div>
          </section>

          {/* Itinerary */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                3
              </span>
              Detailed Itinerary
            </h3>
            <textarea
              required
              rows={10}
              value={itinerary}
              onChange={(e) => setItinerary(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary/20 text-lg font-mono"
            />
          </section>

          {/* Image Gallery */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-cta/10 text-cta flex items-center justify-center">
                4
              </span>
              Image Gallery
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {existingImages.map((img, i) => (
                <div
                  key={`existing-${i}`}
                  className="relative aspect-square rounded-2xl overflow-hidden group"
                >
                  <img
                    src={img.imageUrl}
                    className="w-full h-full object-cover"
                    alt="Existing"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  {img.isThumbnail && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 backdrop-blur text-white text-[10px] font-black uppercase py-1 text-center">
                      Thumbnail
                    </div>
                  )}
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div
                  key={`new-${i}`}
                  className="relative aspect-square rounded-2xl overflow-hidden group"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover border-4 border-primary/20"
                    alt="New"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {existingImages.length + newPreviews.length < 10 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-gray-400 hover:text-primary">
                  <Upload size={32} />
                  <span className="text-[10px] font-black uppercase mt-2">
                    Upload
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </section>

          {/* Schedules */}
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  5
                </span>
                Departure Schedules
              </h3>
              <button
                type="button"
                onClick={addSchedule}
                className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
              >
                <Plus size={18} /> Add Date
              </button>
            </div>

            <div className="space-y-4">
              {schedules.map((s, i) => {
                const isExisting = !!s.id;
                return (
                  <div
                    key={i}
                    className={`p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-end ${isExisting ? "bg-gray-100 border border-gray-200" : "bg-gray-50"}`}
                  >
                    <div className="flex-1 space-y-2 w-full">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Start Date {isExisting && "(Locked)"}
                      </label>
                      <input
                        required
                        type="date"
                        readOnly={isExisting}
                        value={s.startDate}
                        onChange={(e) =>
                          updateSchedule(i, "startDate", e.target.value)
                        }
                        className={`w-full border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 font-bold ${isExisting ? "bg-transparent text-gray-500 cursor-not-allowed" : "bg-white"}`}
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        End Date {isExisting && "(Locked)"}
                      </label>
                      <input
                        required
                        type="date"
                        readOnly={isExisting}
                        value={s.endDate}
                        onChange={(e) =>
                          updateSchedule(i, "endDate", e.target.value)
                        }
                        className={`w-full border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 font-bold ${isExisting ? "bg-transparent text-gray-500 cursor-not-allowed" : "bg-white"}`}
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Capacity {isExisting && "(Locked)"}
                      </label>
                      <input
                        required
                        type="number"
                        min="1"
                        readOnly={isExisting}
                        value={s.capacity}
                        onChange={(e) =>
                          updateSchedule(i, "capacity", Number(e.target.value))
                        }
                        className={`w-full border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 font-black ${isExisting ? "bg-transparent text-gray-400 cursor-not-allowed" : "bg-white"}`}
                      />
                    </div>
                    {!isExisting && (
                      <button
                        type="button"
                        onClick={() => removeSchedule(i)}
                        className="p-4 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="pt-10 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-6 px-20 text-xl font-black shadow-2xl shadow-primary/30 flex items-center gap-3 rounded-[2rem]"
            >
              <Save size={24} /> {loading ? "Updating..." : "Update Tour Now"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditTour;
