import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Named reference model for the external videogame service
 */
export class IgdbNamedReference {
	@IsNotEmpty()
	@IsInt()
	public id!: number;

	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Image model for the external videogame service
 */
export class IgdbImage {
	@IsNotEmpty()
	@IsInt()
	public id!: number;

	@IsNotEmpty()
	@IsString()
	public image_id!: string;
}

/**
 * Involved company model for the external videogame service
 */
export class IgdbInvolvedCompany {
	@IsNotEmpty()
	@IsInt()
	public id!: number;

	@IsOptional()
	@IsBoolean()
	public developer?: boolean;

	@IsOptional()
	@IsBoolean()
	public publisher?: boolean;

	@IsOptional()
	@Type(() => {
		return IgdbNamedReference;
	})
	@ValidateNested()
	public company?: IgdbNamedReference;
}

/**
 * Result of the external videogame service
 */
export class IgdbGame {
	@IsNotEmpty()
	@IsInt()
	public id!: number;

	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsOptional()
	@IsInt()
	public first_release_date?: number;

	@IsOptional()
	@IsString()
	public summary?: string;

	@IsOptional()
	@IsString()
	public storyline?: string;

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return IgdbNamedReference;
	})
	@ValidateNested()
	public genres?: IgdbNamedReference[];

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return IgdbNamedReference;
	})
	@ValidateNested()
	public platforms?: IgdbNamedReference[];

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return IgdbInvolvedCompany;
	})
	@ValidateNested()
	public involved_companies?: IgdbInvolvedCompany[];

	@IsOptional()
	@Type(() => {
		return IgdbImage;
	})
	@ValidateNested()
	public cover?: IgdbImage;
}
