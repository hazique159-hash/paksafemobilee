import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getRetailer(id: string) {
  const { prisma } = await import("@/lib/prisma");
  
  const retailer = await prisma.user.findFirst({
    where: {
      id,
      role: "RETAILER",
      isApproved: true,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      shopName: true,
      shopAddress: true,
      city: true,
      shopImage: true,
      phone: true,
      email: true,
      phoneListings: {
        where: {
          status: "AVAILABLE"
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  return retailer;
}

export default async function RetailerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const retailer = await getRetailer(id);

  if (!retailer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Dark Header Banner Matching dfs.jpeg */}
      <div className="bg-[#111827] text-white py-8 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {retailer.shopName || retailer.name}
            </h1>
            
            <div className="bg-[#10b981] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 shadow-sm mt-1">
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>VERIFIED</span>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{retailer.shopAddress}, {retailer.city}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-semibold text-white">{retailer.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{retailer.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Phones Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-2xl font-extrabold text-[#1e1b4b] mb-6">
          Available Phones ({retailer.phoneListings.length})
        </h2>

        {retailer.phoneListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {retailer.phoneListings.map((phone: any) => (
              <div
                key={phone.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Phone Image Box with Green Available Badge */}
                <div className="relative bg-slate-100 h-64 sm:h-72 flex items-center justify-center p-4">
                  <div className="absolute top-3.5 left-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Available</span>
                  </div>

                  {phone.image ? (
                    <img
                      src={phone.image}
                      alt={`${phone.brand} ${phone.model}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info and Specs Box */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{phone.brand}</p>
                      <h3 className="text-xl font-extrabold text-[#1e1b4b]">{phone.model}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-black text-[#0d9488]">
                        Rs. {phone.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Specs Table Matching dfs.jpeg */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-sm border border-slate-100">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="font-medium text-slate-500">Color</span>
                      <span className="font-bold text-slate-800 capitalize">{phone.color || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="font-medium text-slate-500">Condition</span>
                      <span className="font-bold text-slate-800">{phone.condition}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="font-medium text-slate-500">RAM / Storage</span>
                      <span className="font-bold text-slate-800">{phone.ramStorage || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-bold text-slate-900">No phones available</h3>
            <p className="mt-1 text-xs text-slate-500">This retailer hasn&apos;t listed any phones yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
