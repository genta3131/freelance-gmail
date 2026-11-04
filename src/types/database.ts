// ============================================================
// WorkFlow Hub — Database Types
// Schema disimpan di supabase/migrations. Tipe ini sinkron dengan
// schema SQL. Format Insert/Update mengikuti konvensi generator
// tipe resmi Supabase (tanpa intersection di Insert).
// ============================================================

export type UserRole = "admin" | "freelancer";

export type TaskStatus = "pending" | "in_progress" | "review" | "completed" | "rejected";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type ActivityAction =
  | "task_created"
  | "task_updated"
  | "task_completed"
  | "task_deleted"
  | "freelancer_assigned"
  | "freelancer_created"
  | "freelancer_updated"
  | "client_created"
  | "client_updated"
  | "client_deleted"
  | "submission_created"
  | "submission_approved"
  | "submission_rejected";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  theme: "light" | "dark" | "system";
  notification_email: boolean;
  notification_submission: boolean;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Freelancer = {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  skills: string[];
  hourly_rate: number | null;
  status: "active" | "inactive";
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  client_id: string | null;
  freelancer_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Join fields (query dengan foreign table select) — tidak tersimpan di DB
  client?: Client | null;
  freelancer?: Freelancer | null;
};

export type Submission = {
  id: string;
  task_id: string;
  freelancer_id: string | null;
  notes: string | null;
  file_url: string | null;
  status: SubmissionStatus;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Join fields
  task?: Task | null;
  freelancer?: Freelancer | null;
};

export type ActivityLog = {
  id: string;
  user_id: string | null;
  action: ActivityAction;
  entity_type: "task" | "freelancer" | "client" | "submission" | "auth";
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  // Join fields
  user?: Profile | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          avatar_url?: string | null;
          theme?: "light" | "dark" | "system";
          notification_email?: boolean;
          notification_submission?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          avatar_url?: string | null;
          theme?: "light" | "dark" | "system";
          notification_email?: boolean;
          notification_submission?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: Client;
        Insert: {
          id?: string;
          name: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          company?: string | null;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clients_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      freelancers: {
        Row: Freelancer;
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email?: string | null;
          phone?: string | null;
          skills?: string[];
          hourly_rate?: number | null;
          status?: "active" | "inactive";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          name?: string;
          email?: string | null;
          phone?: string | null;
          skills?: string[];
          hourly_rate?: number | null;
          status?: "active" | "inactive";
          created_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "freelancers_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: Task;
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          client_id?: string | null;
          freelancer_id?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          client_id?: string | null;
          freelancer_id?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          due_date?: string | null;
          created_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_freelancer_id_fkey";
            columns: ["freelancer_id"];
            isOneToOne: false;
            referencedRelation: "freelancers";
            referencedColumns: ["id"];
          },
        ];
      };
      submissions: {
        Row: Submission;
        Insert: {
          id?: string;
          task_id: string;
          freelancer_id?: string | null;
          notes?: string | null;
          file_url?: string | null;
          status?: SubmissionStatus;
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          task_id?: string;
          freelancer_id?: string | null;
          notes?: string | null;
          file_url?: string | null;
          status?: SubmissionStatus;
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "submissions_freelancer_id_fkey";
            columns: ["freelancer_id"];
            isOneToOne: false;
            referencedRelation: "freelancers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: {
          id?: string;
          user_id?: string | null;
          action: ActivityAction;
          entity_type: "task" | "freelancer" | "client" | "submission" | "auth";
          entity_id?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
          action?: ActivityAction;
          entity_type?: "task" | "freelancer" | "client" | "submission" | "auth";
          entity_id?: string | null;
          metadata?: Record<string, unknown> | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      task_status: TaskStatus;
      task_priority: TaskPriority;
      submission_status: SubmissionStatus;
      user_role: UserRole;
    };
  };
};