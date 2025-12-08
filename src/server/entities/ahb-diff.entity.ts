import { Entity, Column, PrimaryColumn } from 'typeorm';

export type DiffStatus = 'unchanged' | 'modified' | 'added' | 'deleted';
export type DiffLineType = 'segmentgroup' | 'segment' | 'dataelementgroup' | 'dataelement' | 'code';

@Entity({ name: 'v_ahb_diff', synchronize: false })
export class AhbDiffLine {
  @Column({ type: 'varchar', nullable: true })
  diff_status?: DiffStatus;

  @Column({ type: 'varchar', nullable: true })
  changed_columns?: string;

  @PrimaryColumn({ type: 'varchar' })
  id_path!: string;

  @Column({ type: 'varchar', nullable: true })
  sort_path?: string;

  @Column({ type: 'varchar', nullable: true })
  path?: string;

  @Column({ type: 'varchar', nullable: true })
  line_type?: DiffLineType;

  // Old version columns
  @PrimaryColumn({ type: 'varchar' })
  old_format_version!: string;

  @PrimaryColumn({ type: 'varchar' })
  old_pruefidentifikator!: string;

  @Column({ type: 'varchar', nullable: true })
  old_segmentgroup_key?: string;

  @Column({ type: 'varchar', nullable: true })
  old_segment_code?: string;

  @Column({ type: 'varchar', nullable: true })
  old_data_element?: string;

  @Column({ type: 'varchar', nullable: true })
  old_qualifier?: string;

  @Column({ type: 'varchar', nullable: true })
  old_line_ahb_status?: string;

  @Column({ type: 'varchar', nullable: true })
  old_line_name?: string;

  @Column({ type: 'varchar', nullable: true })
  old_bedingung?: string;

  @Column({ type: 'varchar', nullable: true })
  old_bedingungsfehler?: string;

  // New version columns
  @PrimaryColumn({ type: 'varchar' })
  new_format_version!: string;

  @PrimaryColumn({ type: 'varchar' })
  new_pruefidentifikator!: string;

  @Column({ type: 'varchar', nullable: true })
  new_segmentgroup_key?: string;

  @Column({ type: 'varchar', nullable: true })
  new_segment_code?: string;

  @Column({ type: 'varchar', nullable: true })
  new_data_element?: string;

  @Column({ type: 'varchar', nullable: true })
  new_qualifier?: string;

  @Column({ type: 'varchar', nullable: true })
  new_line_ahb_status?: string;

  @Column({ type: 'varchar', nullable: true })
  new_line_name?: string;

  @Column({ type: 'varchar', nullable: true })
  new_bedingung?: string;

  @Column({ type: 'varchar', nullable: true })
  new_bedingungsfehler?: string;
}
