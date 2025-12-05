import { useState } from "react";
import { UserData } from "@/hooks/useFirebaseData";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, Eye, Download, Trash2 } from "lucide-react";
import { UserDetailModal } from "./UserDetailModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { AdvancedFilters, FilterOptions } from "./AdvancedFilters";
import { generatePremiumPDF } from "@/lib/pdfGenerator";
import { toast } from "@/hooks/use-toast";

interface UsersTableProps {
  users: UserData[];
  loading: boolean;
  onUserDeleted?: () => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  search: "",
  profileType: [],
  riskScoreMin: 0,
  riskScoreMax: 100,
  emotionScoreMin: 0,
  emotionScoreMax: 100,
  functionScoreMin: 0,
  functionScoreMax: 100,
  dateFrom: "",
  dateTo: "",
};

export function UsersTable({ users, loading, onUserDeleted }: UsersTableProps) {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string; userName: string }>({
    open: false,
    userId: "",
    userName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !user.name?.toLowerCase().includes(searchLower) &&
        !user.email?.toLowerCase().includes(searchLower) &&
        !user.whatsapp?.includes(filters.search)
      ) {
        return false;
      }
    }

    // Profile type filter
    if (filters.profileType.length > 0) {
      if (!filters.profileType.includes(user.result?.profileType || "")) {
        return false;
      }
    }

    // Risk score filter
    const riskScore = user.result?.riskScore || 0;
    if (riskScore < filters.riskScoreMin || riskScore > filters.riskScoreMax) {
      return false;
    }

    // Emotion score filter
    const emotionScore = user.result?.emotionScore || 0;
    if (emotionScore < filters.emotionScoreMin || emotionScore > filters.emotionScoreMax) {
      return false;
    }

    // Function score filter
    const functionScore = user.result?.functionScore || 0;
    if (functionScore < filters.functionScoreMin || functionScore > filters.functionScoreMax) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const userDate = new Date(user.createdAt);
      const fromDate = new Date(filters.dateFrom);
      if (userDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const userDate = new Date(user.createdAt);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (userDate > toDate) return false;
    }

    return true;
  });

  const getProfileBadgeVariant = (profileType: string) => {
    switch (profileType) {
      case "low-risk":
        return "secondary";
      case "moderate-risk":
        return "outline";
      case "high-risk":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", deleteConfirm.userId));
      toast({
        title: "Success",
        description: `${deleteConfirm.userName}'s record has been deleted.`,
      });
      setDeleteConfirm({ open: false, userId: "", userName: "" });
      onUserDeleted?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = async (user: UserData) => {
    setDownloadingPdf(user.id);
    try {
      await generatePremiumPDF(user);
      toast({
        title: "Success",
        description: `PDF report for ${user.name} is downloading...`,
      });
    } catch (error) {
      console.error("PDF download error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingPdf(null);
    }
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return value !== "";
    if (Array.isArray(value)) return value.length > 0;
    if (key.includes("Min")) return value !== DEFAULT_FILTERS[key as keyof FilterOptions];
    if (key.includes("Max")) return value !== DEFAULT_FILTERS[key as keyof FilterOptions];
    return value !== "";
  }).length;

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="text-muted-foreground">Loading patient data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or phone..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10 bg-card border-border"
          />
        </div>
        <AdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          activeFilterCount={activeFilterCount}
        />
        <Badge variant="outline" className="px-3 py-1">
          {filteredUsers.length} / {users.length} patients
        </Badge>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Patient</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Risk Profile</TableHead>
              <TableHead className="font-semibold text-center">Scores</TableHead>
              <TableHead className="font-semibold">Submitted</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <>
                <TableRow
                  key={user.id}
                  className="group cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setExpandedRow(expandedRow === user.id ? null : user.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-accent">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{user.whatsapp || "N/A"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getProfileBadgeVariant(user.result?.profileType || "")}>
                      {user.result?.profileLabel || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Risk</p>
                        <p className="font-semibold text-foreground">{user.result?.riskScore || 0}</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Emotion</p>
                        <p className="font-semibold text-foreground">{user.result?.emotionScore || 0}</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Function</p>
                        <p className="font-semibold text-foreground">{user.result?.functionScore || 0}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPDF(user);
                        }}
                        disabled={downloadingPdf === user.id}
                        title="Download Premium PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({
                            open: true,
                            userId: user.id,
                            userName: user.name || "Patient",
                          });
                        }}
                        title="Delete Record"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {expandedRow === user.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {expandedRow === user.id && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-muted/20 p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Triggers</h4>
                          <div className="flex flex-wrap gap-2">
                            {user.result?.triggers?.map((trigger, i) => (
                              <Badge key={i} variant="outline" className="bg-card">
                                {trigger}
                              </Badge>
                            )) || (
                              <span className="text-muted-foreground text-sm">No triggers identified</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Recommended Exercises</h4>
                          <div className="space-y-2">
                            {user.result?.exercises?.slice(0, 3).map((exercise) => (
                              <div key={exercise.id} className="text-sm">
                                <span className="font-medium text-foreground">{exercise.name}</span>
                                <span className="text-muted-foreground"> - {exercise.duration}</span>
                              </div>
                            )) || (
                              <span className="text-muted-foreground text-sm">No exercises assigned</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {users.length === 0 ? "No patients found." : "No results match your filters. Try adjusting your search criteria."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserDetailModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteConfirm({ open: false, userId: "", userName: "" })}
        isDeleting={isDeleting}
        userName={deleteConfirm.userName}
      />
    </div>
  );
}