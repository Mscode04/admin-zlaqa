import { useState } from "react";
import { CommunityMember } from "@/hooks/useFirebaseData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone } from "lucide-react";

interface CommunityTableProps {
  members: CommunityMember[];
  loading: boolean;
}

export function CommunityTable({ members, loading }: CommunityTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter(member =>
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span className="text-muted-foreground">Loading community members...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {filteredMembers.length} members
        </Badge>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Member</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Phone</TableHead>
              <TableHead className="font-semibold">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow 
                key={member.id}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-accent">
                        {member.email?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {member.email?.split("@")[0] || "Unknown"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span className="text-sm">{member.phone || "N/A"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">{formatDate(member.joinedAt)}</p>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No community members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}